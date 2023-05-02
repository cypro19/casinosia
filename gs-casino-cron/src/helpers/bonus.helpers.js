import axios from "axios";
import db from "../db/models";
import CryptoJS from "crypto-js";
import Logger from "../libs/logger";
import encode from "crypto-js/enc-hex";
import { Op, Sequelize } from "sequelize";
import config from "../configs/app.config";
import { TransactionHandler } from "./transaction.helper";
import {
  TRANSACTION_STATUS,
  AMOUNT_TYPE,
  ROLE,
  TRANSACTION_TYPE,
  BONUS_STATUS,
  WAGER_STATUS,
  BONUS_TYPE,
} from "../libs/constants";

export const signMicroserviceBody = (body) => {
  return CryptoJS.HmacMD5(
    body,
    config.get("microService.accessToken")
  ).toString(encode);
};

export const getElasticOptions = async ({
  userDetails,
  userWallet,
  conversionRate,
  game,
  amount,
  nonCashAmount,
}) => {
  if (amount) {
    nonCashAmount = 0;
  } else {
    amount = 0;
  }

  const elasticOptions = {
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    parentType: userDetails.parentType,
    parentId: userDetails.parentId,
    kycStatus: userDetails.kycStatus,
    totalAmount:
      parseInt(userWallet.amount) +
      parseInt(amount) +
      parseInt(userWallet.nonCashAmount),
    afterBalance: parseInt(userWallet.amount) + parseInt(amount),
    nonCashAmount: parseInt(userWallet.nonCashAmount) + parseInt(nonCashAmount),
    userCreatedAt: userDetails.createdAt,
    userUpdatedAt: userDetails.updatedAt,
    statusValue: "pending",
    description: null,
    gameAggregator: null,
    gameIdentifier: null,
    isFirstDeposit: false,
    bonusId: null,
    sourceCurrency: userWallet.currencyCode,
    targetCurrency: userWallet.currencyCode,
    amountInOtherCurrencies: null,
  };
  return elasticOptions;
};

export const expireBonus = async (elasticClient) => {
  Logger.info("Expire Bonus", { message: "Getting User Bonuses" });

  const users = await db.User.findAll({
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

  Logger.info("Expire Bonus", { message: `User Count ${users.length}` });

  if (users) {
    for (const user of users) {
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
            const bonusInfo = await db.Bonus.findOne({
              where: { bonusId: bonusDetail.bonusId },
              attributes: ["bonusId", "isSticky"],
            });

            if (bonusInfo.isSticky) {
              const transactionDetail = await db.TransactionBanking.findOne({
                where: {
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

              const elasticOptions = await getElasticOptions({
                userDetails: user,
                userWallet: user.userWallet,
                amount: bonusDetail.cashAmount,
              });

              if (bonusDetail.cashAmount) {
                await TransactionHandler({
                  sourceUser: user.dataValues,
                  amountType: AMOUNT_TYPE.CASH,
                  addAmount: bonusDetail.cashAmount,
                  beforeBalance: bonusDetail.cashAmount,
                  transactionType: TRANSACTION_TYPE.EXPIRED,
                  status: TRANSACTION_STATUS.SUCCESS,
                  isSuccess: true,
                  options: { ...elasticOptions, elasticClient },
                });
              } else {
                await TransactionHandler({
                  sourceUser: user.dataValues,
                  amountType: AMOUNT_TYPE.NON_CASH,
                  addAmount: user.userWallet.nonCashAmount,
                  transactionType: TRANSACTION_TYPE.EXPIRED,
                  status: TRANSACTION_STATUS.SUCCESS,
                  isSuccess: true,
                  options: { ...elasticOptions, elasticClient },
                });
              }

              await user.userWallet.set({ ...updatedWallet }).save();
            }
          } else if (bonusDetail.bonusType === BONUS_TYPE.FREESPINS) {
            bonusClaimed = await db.CasinoTransaction.findOne({
              where: { actionId: bonusDetail.uniqueId },
              attributes: ["casinoTransactionId"],
            });

            if (!bonusClaimed) {
              const body = { issueId: bonusDetail.uniqueId };
              try {
                await axios.post(
                  `${config.get(
                    "microService.url"
                  )}/api/user/cancel-free-spins`,
                  body,
                  {
                    headers: {
                      "MICRO-SERVICE-REQUEST-SIGN": signMicroserviceBody(body),
                    },
                  }
                );

                Logger.info("Expire Bonus", {
                  message: `Free-spins cancelled IssueId ${bonusDetail.uniqueId}`,
                });
              } catch {
                Logger.info("Expire Bonus", {
                  message: `Unable to cancel free spins  IssueId ${bonusDetail.uniqueId}`,
                });
              }
            }
          }
        }
      }
    }
  }
};
