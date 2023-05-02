import db from "../../db/models";
import schedule from "node-schedule";
import { Op, Sequelize } from "sequelize";
import { CancelFreeSpinService } from "../casino";
import { getElasticOptions } from "../helper/elastic";
import { TransactionHandlerService } from "../wallet";
import { createNewEntity, getAll, getOne } from "./crud";
import {
  AMOUNT_TYPE,
  BONUS_STATUS,
  BONUS_TYPE,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WAGER_STATUS,
  ACTION,
} from "../../utils/constant";

export const totalBets = async (fromDate, toDate, userId) => {
  const bets = await db.CasinoTransaction.sum("amount", {
    where: {
      userId,
      isSticky: false,
      actionType: ACTION.BET,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          ">=",
          new Date(fromDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          "<=",
          new Date(toDate)
        ),
      ],
    },
  });

  return bets;
};

export const totalWins = async (fromDate, toDate, userId) => {
  const wins = await db.CasinoTransaction.sum("amount", {
    where: {
      userId,
      actionType: ACTION.WIN,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          ">=",
          new Date(fromDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          "<=",
          new Date(toDate)
        ),
      ],
    },
  });

  return wins;
};

export const totalDeposit = async (fromDate, toDate, userId) => {
  const total = await db.TransactionBanking.sum("amount", {
    where: {
      actioneeId: userId,
      actioneeType: ROLE.USER,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          ">=",
          new Date(fromDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          "<=",
          new Date(toDate)
        ),
      ],
    },
  });

  return total;
};

export const expireBonus = async () => {
  const users = await getAll({
    model: db.User,
    include: [
      { model: db.Wallet, as: "userWallet" },
      {
        model: db.UserBonus,
        as: "bonus",
        where: {
          status: {
            [Op.in]: [
              BONUS_STATUS.PENDING,
              BONUS_STATUS.CLAIMING,
              BONUS_STATUS.IN_PROCESS,
              BONUS_STATUS.ACTIVE,
            ],
          },
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("date", Sequelize.col("expire_at")),
              "<",
              new Date(Date.now())
            ),
          ],
        },
        required: false,
      },
    ],
  });

  if (users) {
    users.forEach(async (user) => {
      if (user.bonus.length) {
        const bonusIds = [];
        let activeBonus = false;
        let bonusDetail;

        user.bonus.forEach(async (element) => {
          bonusIds.push(element.userBonusId);
          if (element.status === BONUS_STATUS.ACTIVE) {
            activeBonus = true;
            bonusDetail = element;
          }
        });

        await db.UserBonus.update(
          {
            status: BONUS_STATUS.EXPIRED,
            wageringStatus: WAGER_STATUS.CANCELLED,
          },
          {
            where: {
              userBonusId: bonusIds,
            },
          }
        );

        if (activeBonus) {
          let walletAmount, bonusClaimed;
          let updatedWallet = { nonCashAmount: 0 };
          user.dataValues.wallet = user.userWallet.dataValues;

          if (bonusDetail.bonusType === BONUS_TYPE.DEPOSIT) {
            const bonusInfo = await getOne({
              model: db.Bonus,
              data: { bonusId: bonusDetail.bonusId },
              attributes: ["bonusId", "isSticky"],
            });

            if (bonusInfo.isSticky) {
              const transactionDetail = await getOne({
                model: db.TransactionBanking,
                data: {
                  actioneeType: { [Op.in]: [ROLE.USER, ROLE.ADMIN] },
                  targetId: user.userId,
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
                updatedWallet = { ...updatedWallet, amount: walletAmount };
              }

              if (bonusDetail.cashAmount) {
                const elasticOptions = await getElasticOptions({
                  userDetails: user,
                  userWallet: user.userWallet,
                  amount: bonusDetail.cashAmount,
                });

                await TransactionHandlerService.execute({
                  sourceUser: user.dataValues,
                  amountType: AMOUNT_TYPE.CASH,
                  addAmount: bonusDetail.cashAmount,
                  beforeBalance: bonusDetail.cashAmount,
                  transactionType: TRANSACTION_TYPE.EXPIRED,
                  status: TRANSACTION_STATUS.SUCCESS,
                  isSuccess: true,
                  options: elasticOptions,
                });
              }
            }
          } else if (bonusDetail.bonusType === BONUS_TYPE.FREESPINS) {
            bonusClaimed = await getOne({
              model: db.CasinoTransaction,
              data: { actionId: bonusDetail.uniqueId },
              attributes: ["casinoTransactionId"],
            });

            if (!bonusClaimed) {
              await CancelFreeSpinService.execute({
                issueId: bonusDetail.uniqueId,
              });
            }
          }

          if (bonusDetail.bonusType === BONUS_TYPE.FREESPINS && bonusClaimed) {
            const elasticOptions = await getElasticOptions({
              userDetails: user,
              userWallet: user.userWallet,
              nonCashAmount: 0,
            });
            await TransactionHandlerService.execute({
              sourceUser: user.dataValues,
              amountType: AMOUNT_TYPE.NON_CASH,
              addAmount: user.userWallet.nonCashAmount,
              transactionType: TRANSACTION_TYPE.EXPIRED,
              status: TRANSACTION_STATUS.SUCCESS,
              isSuccess: true,
              options: elasticOptions,
            });

            await user.userWallet.set({ ...updatedWallet }).save();
          }
        }
      }
    });
  }
};

export const expireBonusCron = async () => {
  schedule.scheduleJob("0 0 * * *", async () => await expireBonus());
};

export const giveJoiningBonus = async (userData) => {
  const joiningBonus = await db.Bonus.findOne({
    raw: true,
    where: {
      bonusType: BONUS_TYPE.JOINING,
      isActive: true,
    },
  });

  if (joiningBonus) {
    if (
      new Date(joiningBonus.validFrom) <= new Date() &&
      new Date(joiningBonus.validTo) >= new Date()
    ) {
      const joiningBonusAmount = parseFloat(
        joiningBonus.currency[userData.currencyCode].maxWinAmount
      );

      const userWallet = await db.Wallet.findOne({
        raw: true,
        where: { ownerId: userData.userId, ownerType: ROLE.USER },
      });

      userData.dataValues.wallet = userWallet;

      const elasticOptions = await getElasticOptions({
        userDetails: userData,
        userWallet,
        nonCashAmount: userWallet.nonCashAmount,
      });

      const transaction = await db.sequelize.transaction();

      const transactionHandler = await TransactionHandlerService.execute({
        sourceUser: userData.dataValues,
        amountType: AMOUNT_TYPE.NON_CASH,
        addAmount: joiningBonusAmount,
        transactionType: TRANSACTION_TYPE.BONUS,
        status: TRANSACTION_STATUS.SUCCESS,
        isSuccess: true,
        options: elasticOptions,
        transaction,
      });

      if (transactionHandler.result.success) {
        const data = {
          transactionId:
            transactionHandler.result.transactionBanking.transactionBankingId,
          issuerId: userData.userId,
          issuerRole: ROLE.USER,
          bonusId: joiningBonus.bonusId,
          userId: userData.userId,
          bonusType: joiningBonus.bonusType,
          status: BONUS_STATUS.COMPLETED,
          bonusAmount: joiningBonusAmount,
          primaryCurrencyAmount:
            transactionHandler.result.transactionBanking.primaryCurrencyAmount,
          claimedAt: new Date(),
          expireAt: null,
        };

        await createNewEntity({ model: db.UserBonus, data, transaction });

        await db.Wallet.update(
          {
            nonCashAmount: Sequelize.literal(
              `non_cash_amount + ${joiningBonusAmount}`
            ),
          },
          {
            where: { ownerId: userData.userId, ownerType: ROLE.USER },
            transaction,
          }
        );
        await transaction.commit();
        return true;
      } else {
        await transaction.rollback();
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};
