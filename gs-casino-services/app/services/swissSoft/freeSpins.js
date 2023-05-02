import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { getPrimaryCurrencyAmount } from "../../utils/common";
import {
  ACTION,
  AMOUNT_TYPE,
  BONUS_STATUS,
  KEYS,
  ROLE,
  TRANSACTION_STATUS,
  WAGER_STATUS,
} from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/responseMessage";
import { getOne } from "../common/crud";
import { liveUpdateWallet } from "../common/realTime";
import { TransactionHandlerService } from "../common/transactionHandler";

const constraints = {
  issue_id: {
    presence: { allowEmpty: false },
  },
  status: {
    presence: { allowEmpty: false },
  },
  total_amount: {
    presence: false,
  },
};

export class FreeSpinsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      issue_id: issueId,
      status,
      total_amount: totalAmount,
    } = this.filteredArgs;
    const transaction = this.context;
    let newAmount, amountToConvert;

    try {
      const userBonus = await getOne({
        model: db.UserBonus,
        data: { uniqueId: issueId },
        attributes: [
          "userBonusId",
          "bonusId",
          "userId",
          "bonusAmount",
          "amountToWager",
          "transactionId",
          "primaryCurrencyAmount",
          "wageringStatus",
          "status",
        ],
        include: {
          model: db.Bonus,
          as: "bonus",
          attributes: ["bonusId", "currency"],
        },
        transaction,
      });

      if (!userBonus)
        return this.addError(
          ERRORS.BAD_DATA,
          "User Bonus " + ERROR_MSG.NOT_FOUND
        );

      const userExist = await getOne({
        model: db.User,
        data: { userId: userBonus.userId },
        attributes: ["userId", "uniqueId", "currencyCode", "parentId"],
        transaction,
      });

      if (!userExist)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_EXISTS);

      if (status === "played") {
        if (totalAmount > 0) {
          const userWallet = await getOne({
            model: db.Wallet,
            data: { ownerId: userBonus.userId, ownerType: ROLE.USER },
            attributes: ["amount", "walletId", "currencyCode"],
            transaction,
          });

          if (!userWallet)
            return this.addError(
              ERRORS.NOT_FOUND,
              "Wallet " + ERROR_MSG.NOT_FOUND
            );

          const transactionDetails = {
            userId: userBonus.userId,
            walletId: userWallet.walletId,
            actionType: ACTION.FREE_SPINS,
            actionId: issueId,
            currencyCode: userExist.currencyCode,
            adminId: userExist.parentId,
            status: TRANSACTION_STATUS.COMPLETED,
            transaction,
          };

          if (
            userBonus.bonus?.currency[userWallet.currencyCode] !== undefined &&
            totalAmount / 100 >
              userBonus.bonus?.currency[userWallet.currencyCode][
                KEYS.MAX_WIN_AMOUNT
              ]
          ) {
            amountToConvert =
              userBonus.bonus.currency[userWallet.currencyCode][
                KEYS.MAX_WIN_AMOUNT
              ];
          } else amountToConvert = totalAmount / 100;

          amountToConvert = parseFloat(amountToConvert);

          const { amount, conversionRate } = await getPrimaryCurrencyAmount({
            currencyCode: userWallet.currencyCode,
            amount: amountToConvert,
            transaction,
          });

          transactionDetails.amountType = AMOUNT_TYPE.CASH;
          transactionDetails.beforeBalance = userWallet.amount;
          transactionDetails.amount = amountToConvert;
          transactionDetails.conversionRate = conversionRate;
          transactionDetails.primaryCurrencyAmount = amount;

          newAmount = userWallet.amount + amountToConvert;
          newAmount = Math.round(newAmount * 100) / 100;
          await userWallet.set({ amount: newAmount }).save({ transaction });

          transactionDetails.afterBalance = newAmount;
          const casinoTransaction = await TransactionHandlerService.execute({
            ...transactionDetails,
          });

          if (casinoTransaction.result.success) {
            await userBonus
              .set({
                bonusAmount: userWallet.amount,
                amountToWager: 0,
                transactionId:
                  casinoTransaction.result?.casinoTransaction
                    ?.casinoTransactionId,
                primaryCurrencyAmount:
                  casinoTransaction.result?.casinoTransaction
                    ?.primaryCurrencyAmount,
                wageringStatus: WAGER_STATUS.COMPLETED,
                status: BONUS_STATUS.COMPLETED,
              })
              .save({ transaction });
          }
        } else {
          await userBonus
            .set({
              bonusAmount: 0,
              wageringStatus: WAGER_STATUS.CANCELLED,
              status: BONUS_STATUS.COMPLETED,
            })
            .save({ transaction });
        }
      }

      const getBalance = await getOne({
        model: db.Wallet,
        data: { ownerId: userBonus.userId, ownerType: ROLE.USER },
        attributes: ["amount", "nonCashAmount"],
        transaction,
      });

      await liveUpdateWallet({
        userId: userExist.userId,
        userUuid: userExist.uniqueId,
        cash: getBalance.amount,
        nonCash: getBalance.nonCashAmount,
      });

      return {
        code: 200,
        data: {
          ownerId: userBonus.userId,
          userId: userExist.userId,
          userUuid: userExist.uniqueId,
        },
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
