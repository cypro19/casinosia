import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { liveUpdateWallet } from "../helper/email";
import { insertUpdate, totalBonus } from "../helper/customerIo";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { IssueFreeSpinService } from "./issueFreespins";
import { createNewEntity, getOne, getAll, updateEntity } from "../helper/crud";
import { TransactionHandlerService } from "../wallet/transactionHandler";
import {
  createConnection,
  bonusObject,
  walletObject,
} from "../helper/rabbitMq";
import {
  totalBets,
  totalWins,
  getTimePeriod,
  getCashbackParameters,
} from "../helper/bonus";
import {
  BONUS_STATUS,
  BONUS_TYPE,
  KEYS,
  AMOUNT_TYPE,
  TRANSACTION_TYPE,
  WAGER_STATUS,
} from "../../utils/constant";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
  bonusId: {
    presence: { allowEmpty: false },
  },
  gameIds: {
    presence: false,
  },
  amount: {
    presence: false,
  },
  quantity: {
    presence: false,
  },
  betLevel: {
    presence: false,
  },
  validTo: {
    presence: false,
  },
  validFrom: {
    presence: false,
  },
};

export class IssueBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      id,
      userType,
      userId,
      bonusId,
      gameIds,
      quantity,
      betLevel,
      validTo,
      validFrom,
      amount,
      user,
    } = this.filteredArgs;
    let data, gameData, spins, level;
    const games = {};

    try {
      const userDetails = await getOne({
        model: db.User,
        data: { userId },
        include: [
          { model: db.Wallet, as: "userWallet" },
          {
            model: db.UserBonus,
            as: "userBonus",
            where: {
              status: {
                [Op.in]: [
                  BONUS_STATUS.ACTIVE,
                  BONUS_STATUS.CLAIMING,
                  BONUS_STATUS.IN_PROCESS,
                ],
              },
            },
            required: false,
          },
        ],
      });

      if (!userDetails)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_EXISTS);

      const bonusExists = await getOne({
        model: db.Bonus,
        data: {
          bonusId,
        },
      });

      if (!bonusExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_ISSUE);
      }

      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + bonusExists.daysToClear);

      data = {
        bonusId: bonusExists.bonusId,
        userId,
        bonusType: bonusExists.bonusType,
        status: BONUS_STATUS.PENDING,
        expireAt: expireDate,
        issuerRole: userType,
        issuerId: id,
      };

      if (bonusExists.bonusType === BONUS_TYPE.FREESPINS) {
        gameData = bonusExists.gameIds;
        spins = bonusExists.quantity;
        level = bonusExists.other?.betLevel;

        if (gameIds) {
          if (typeof gameIds === "string") gameIds = JSON.parse(gameIds);
          gameData = [...new Set(gameIds)];
        }

        if (quantity) spins = parseInt(quantity);
        if (betLevel) level = betLevel;
        if (validTo) data = { ...data, expireAt: validTo };
        if (validFrom) data = { ...data, claimedAt: validFrom };

        const gameList = await getAll({
          model: db.CategoryGame,
          data: { masterCasinoGameId: { [Op.in]: gameData } },
          attributes: ["categoryGameId"],
          include: {
            model: db.MasterCasinoGame,
            attributes: ["masterCasinoGameId", "identifier"],
          },
        });

        gameList.forEach((game) => {
          games[game.dataValues.MasterCasinoGame.identifier] =
            game.dataValues.MasterCasinoGame.identifier;
        });

        data = {
          ...data,
          freeSpinsQty: spins,
          games,
          betLevel: parseInt(level),
        };
      }

      if (bonusExists.bonusType === BONUS_TYPE.WAGERING) {
        const { bonusPercentage, wageringMultiplier } =
          await getCashbackParameters(userDetails.level, bonusExists);

        if (!amount) {
          const { fromDate, toDate } = await getTimePeriod(bonusExists);

          const bets = await totalBets(fromDate, toDate, userId);
          const wins = await totalWins(fromDate, toDate, userId);

          const difference = bets - wins;

          if (difference <= 0)
            return this.addError(
              ERRORS.BAD_DATA,
              "Player is not eligible for wagering cashback."
            );

          let bonusAmount =
            Math.round(difference * bonusPercentage * 100) / 100;
          if (
            bonusAmount >
            bonusExists.currency[userDetails.currencyCode][
              KEYS.MAX_BONUS_THRESHOLD
            ]
          ) {
            bonusAmount =
              bonusExists.currency[userDetails.currencyCode][
                KEYS.MAX_BONUS_THRESHOLD
              ];
          }

          amount = bonusAmount;
        }

        const amountToWager =
          Math.round(amount * wageringMultiplier * 100) / 100;
        data = { ...data, bonusAmount: amount, amountToWager };
      } else if (amount && bonusExists.bonusType === BONUS_TYPE.MATCH) {
        data = {
          ...data,
          bonusType: `${bonusExists.bonusType}_${AMOUNT_TYPE.NON_CASH}`,
          bonusAmount: amount,
          amountToWager:
            Math.round(amount * bonusExists.wageringMultiplier * 100) / 100,
        };
      }

      const transaction = await db.sequelize.transaction();

      if (!userDetails.userBonus.length && amount) {
        const transactionHandler = await TransactionHandlerService.execute({
          sourceUser: user,
          targetUser: userDetails.dataValues,
          amountType: AMOUNT_TYPE.NON_CASH,
          addAmount: parseFloat(amount),
          transactionType: TRANSACTION_TYPE.BONUS,
          transaction,
        });

        if (!transactionHandler.result.success) {
          await transaction.rollback();
          return this.addError(
            transactionHandler.result.err_type,
            transactionHandler.result.err
          );
        }

        await userDetails.userWallet
          .set({
            nonCashAmount:
              userDetails.userWallet.nonCashAmount + parseFloat(amount),
          })
          .save({ transaction });

        transactionHandler.result.transactionBanking.domainName =
          userDetails?.domain;
        const details = await walletObject(
          transactionHandler.result.transactionBanking
        );
        await createConnection("PostWallets", details);

        data = {
          ...data,
          transactionId:
            transactionHandler.result.transactionBanking.transactionBankingId,
          wageringStatus: WAGER_STATUS.STARTED,
          status: BONUS_STATUS.ACTIVE,
        };
      }

      const createBonus = await createNewEntity({
        model: db.UserBonus,
        data,
        transaction,
      });
      await bonusExists
        .set({ claimedCount: bonusExists.claimedCount + 1 })
        .save({ transaction });

      if (
        bonusExists.bonusType === BONUS_TYPE.FREESPINS &&
        !userDetails.userBonus.length &&
        quantity &&
        createBonus.claimedAt <= new Date(Date.now())
      ) {
        userDetails.dataValues.issueId = createBonus.uniqueId;

        let request = {
          user: userDetails,
          games: Object.keys(games),
          freeSpinsQuantity: createBonus.freeSpinsQty,
          validUntilDays: createBonus.expireAt,
        };
        if (createBonus.betLevel)
          request = { ...request, betLevel: createBonus.betLevel };

        const spinsIssue = await IssueFreeSpinService.execute(request);

        if (!spinsIssue.result.success) {
          await transaction.rollback();
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_AVAIL);
        }

        await updateEntity({
          model: db.UserBonus,
          values: { userBonusId: createBonus.userBonusId },
          data: { status: BONUS_STATUS.ACTIVE },
          transaction,
        });
      }

      await transaction.commit();

      if (createBonus.status === BONUS_STATUS.ACTIVE) {
        const { total, count } = await totalBonus(userId);

        insertUpdate(userId, {
          bonus_last_date: createBonus.expireAt,
          last_bonus_info: {
            bonus_id: createBonus.bonusId,
            currency_code: userDetails.currencyCode,
            days_to_clear: bonusExists.daysToClear,
            name: bonusExists.promotionTitle,
            wagering_requirement: createBonus.amountToWager,
            deposit_min: bonusExists.currency[userDetails.currencyCode]
              ? bonusExists.currency[userDetails.currencyCode][KEYS.MIN_DEPOSIT]
              : null,
            applied_bonus_id: bonusExists.appliedBonusId,
            spins_quantity: createBonus.quantity,
            time_period: bonusExists.timePeriod,
            wagering_type: bonusExists.wageringRequirementType,
            bonus_type: createBonus.bonusType,
          },
          last_claimable_bonus: createBonus.bonusId,
          bonus_deposit_ratio: null,
          bonus_total_amount: total,
          claimable_bonus_count: count,
          bonus_account_balance: userDetails.userWallet.nonCashAmount,
        });
      }

      let bonusValues = {
        ...createBonus,
        bonus: { promotionTitle: bonusExists.promotionTitle },
        domainName: userDetails?.domain,
      };

      if (bonusValues.transactionId) {
        const transaction = await getOne({
          model: db.TransactionBanking,
          data: { transactionBankingId: createBonus.transactionId },
          attributes: [
            "transactionBankingId",
            "currencyCode",
            "conversionRate",
          ],
        });

        bonusValues = { ...createBonus, transaction: transaction.dataValues };
      }

      const details = await bonusObject(bonusValues);
      await createConnection("PostBonuses", details);

      await liveUpdateWallet({
        userId,
        targetOrigin: userDetails?.domain,
        cash: userDetails.userWallet.amount,
        nonCash: userDetails.userWallet.nonCashAmount,
      });

      return { createBonus, message: SUCCESS_MSG.BONUS_ISSUE };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
