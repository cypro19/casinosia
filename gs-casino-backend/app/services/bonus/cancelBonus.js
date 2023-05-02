import { Op } from "sequelize";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import { CancelFreeSpinService } from "../casino";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getElasticOptions } from "../helper/elastic";
import { TransactionHandlerService } from "../wallet";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { LiveUpdateWalletService } from "../microservice";
import {
  AMOUNT_TYPE,
  BONUS_STATUS,
  BONUS_TYPE,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WAGER_STATUS,
} from "../../utils/constant";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  bonusId: {
    presence: false,
  },
  userBonusId: {
    presence: false,
  },
  user: {
    presence: false,
  },
  origin: {
    presence: false,
  },
};

export class CancelBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, bonusId, userBonusId, user, origin } = this.filteredArgs;

    let updateStatus = BONUS_STATUS.CANCELLED;
    let query = { userId: id, bonusId };

    try {
      if (user && userBonusId && origin) {
        query = { userId: id, userBonusId };
      }

      const userBonusExists = await getOne({
        model: db.UserBonus,
        data: query,
        order: [["userBonusId", "DESC"]],
        include: {
          model: db.Bonus,
          as: "bonus",
          attributes: ["bonusId", "isSticky", "promotionTitle"],
        },
      });

      if (!userBonusExists) {
        return this.addError(ERRORS.BAD_DATA, "Bonus " + ERROR_MSG.NOT_FOUND);
      }

      const transaction = await db.sequelize.transaction();

      if (userBonusExists.status === BONUS_STATUS.ACTIVE) {
        let updateObject = { nonCashAmount: 0 };
        updateStatus = BONUS_STATUS.FORFEIT;
        let walletAmount, bonusClaimed;

        user.dataValues.wallet = user.userWallet;

        if (userBonusExists.bonusType === BONUS_TYPE.FREESPINS) {
          bonusClaimed = await getOne({
            model: db.CasinoTransaction,
            data: { actionId: userBonusExists.uniqueId },
            attributes: ["casinoTransactionId"],
          });

          if (!bonusClaimed) {
            const cancelSpins = await CancelFreeSpinService.execute({
              issueId: userBonusExists.uniqueId,
            });

            if (!cancelSpins.result.success) {
              return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_DELETE);
            }
          }
        } else if (
          userBonusExists.bonus.isSticky &&
          userBonusExists.bonusType === BONUS_TYPE.DEPOSIT
        ) {
          const transactionDetail = await getOne({
            model: db.TransactionBanking,
            data: {
              actioneeType: {
                [Op.in]: [ROLE.USER, ROLE.ADMIN, ROLE.SUPERADMIN],
              },
              targetId: id,
              status: TRANSACTION_STATUS.SUCCESS,
              amountType: AMOUNT_TYPE.CASH,
              transactionType: {
                [Op.in]: [
                  TRANSACTION_TYPE.DEPOSIT,
                  TRANSACTION_TYPE.BONUS_TO_CASH,
                  TRANSACTION_TYPE.ADD_BALANCE,
                  TRANSACTION_TYPE.REMOVE_BALANCE,
                ],
              },
              transactionBankingId: { [Op.lte]: userBonusExists.transactionId },
            },
            order: [["transactionBankingId", "DESC"]],
            attributes: [
              "transactionBankingId",
              "beforeBalance",
              "amount",
              "actioneeType",
            ],
          });

          if (transactionDetail) {
            walletAmount = transactionDetail.beforeBalance;

            if (
              transactionDetail.actioneeType === ROLE.ADMIN ||
              transactionDetail.actioneeType === ROLE.SUPERADMIN
            )
              walletAmount =
                transactionDetail.amount + transactionDetail.beforeBalance;
            updateObject = { ...updateObject, amount: walletAmount };
          }

          if (userBonusExists.cashAmount) {
            const elasticOptions = await getElasticOptions({
              userDetails: user.dataValues,
              userWallet: user.userWallet,
              amount: userBonusExists.cashAmount,
            });

            const transactionHandler = await TransactionHandlerService.execute({
              sourceUser: user.dataValues,
              amountType: AMOUNT_TYPE.CASH,
              addAmount: userBonusExists.cashAmount,
              beforeBalance: userBonusExists.cashAmount,
              transactionType: TRANSACTION_TYPE.FORFEIT,
              status: TRANSACTION_STATUS.SUCCESS,
              isSuccess: true,
              options: elasticOptions,
              transaction,
            });

            if (!transactionHandler.result.success) {
              await transaction.rollback();
              return this.addError(
                ERRORS.BAD_DATA,
                transactionHandler.result.err_type,
                transactionHandler.result.err
              );
            }
          }
        }
        await user.userWallet.set({ ...updateObject }).save({ transaction });
      } else if (
        userBonusExists.status !== BONUS_STATUS.PENDING &&
        userBonusExists.status !== BONUS_STATUS.CLAIMING &&
        userBonusExists.status !== BONUS_STATUS.IN_PROCESS
      ) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_DELETE);
      }

      await userBonusExists
        .set({
          status: updateStatus,
          wageringStatus: WAGER_STATUS.CANCELLED,
          cancelledBy: user.firstName + " " + user.lastName,
        })
        .save({ transaction });
      await transaction.commit();

      await LiveUpdateWalletService.execute({
        userUuid: user.uniqueId,
        cash: user.userWallet.amount,
        nonCash: user.userWallet.nonCashAmount,
        userId: id,
        origin: "user-end",
      });

      return { success: true, message: SUCCESS_MSG.CANCEL_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
