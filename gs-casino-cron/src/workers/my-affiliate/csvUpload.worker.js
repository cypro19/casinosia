import db from "../../db/models";
import { Sequelize } from "sequelize";
import Logger from "../../libs/logger";
import "../../libs/setUpGraceFullShutDown";
import WorkerBase from "../../libs/workerBase";
import { affiliateTransaction } from "../../helpers/myAffiliates.helpers";
import {
  ACTION,
  AMOUNT_TYPE,
  BONUS_TYPE,
  CASINO_TRANSACTION_STATUS,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../libs/constants";

class MyAffiliateCsvUploadWorker extends WorkerBase {
  async run() {
    try {
      const dateQueryTransaction = [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("TransactionBanking.created_at")),
          "=",
          new Date(Date.now())
        ),
      ];
      const dateQueryCasino = [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("CasinoTransaction.created_at")),
          "=",
          new Date(Date.now())
        ),
      ];
      const dateQueryBonus = [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("bonus.created_at")),
          "=",
          new Date(Date.now())
        ),
      ];

      const transactions = await db.TransactionBanking.findAll({
        where: { ...dateQueryTransaction, status: TRANSACTION_STATUS.SUCCESS },
        attributes: [
          "targetId",
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "withdrawls",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "deposits",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when amount_type = ${AMOUNT_TYPE.CASH} and transaction_type = '${TRANSACTION_TYPE.ADD_BALANCE}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "moneyAdded",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when amount_type = ${AMOUNT_TYPE.CASH} and transaction_type = '${TRANSACTION_TYPE.REMOVE_BALANCE}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "moneyRemoved",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when amount_type = ${AMOUNT_TYPE.NON_CASH} and transaction_type = '${TRANSACTION_TYPE.ADD_BALANCE}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "noncashMoneyAdded",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when amount_type = ${AMOUNT_TYPE.NON_CASH} and transaction_type = '${TRANSACTION_TYPE.REMOVE_BALANCE}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "noncashMoneyRemoved",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when amount_type = ${AMOUNT_TYPE.NON_CASH} and transaction_type = '${TRANSACTION_TYPE.FORFEIT}' then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "bonusForfeitedAmount",
          ],
        ],
        include: [
          {
            model: db.User,
            attributes: [],
            as: "transactionUser",
            where: { affiliateStatus: true },
          },
        ],
        group: [db.sequelize.col("TransactionBanking.target_id")],
        raw: true,
      });

      const casinoTransactions = await db.CasinoTransaction.findAll({
        where: {
          ...dateQueryCasino,
          status: CASINO_TRANSACTION_STATUS.COMPLETED,
        },
        attributes: [
          "userId",
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when action_type = '${ACTION.BET}' and amount_type = ${AMOUNT_TYPE.CASH} then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "casinoBets",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when action_type = '${ACTION.WIN}' and amount_type = ${AMOUNT_TYPE.CASH} then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "casinoWins",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when action_type = '${ACTION.BET}' and amount_type = ${AMOUNT_TYPE.NON_CASH} then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "casinoBonusBets",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when action_type = '${ACTION.WIN}' and amount_type = ${AMOUNT_TYPE.NON_CASH} then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "casinoBonusWins",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when action_type = '${ACTION.FREESPINS}' and amount_type = ${AMOUNT_TYPE.CASH} then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "cashCasinoCostFreerounds",
          ],
          [
            db.sequelize.literal(
              `ROUND(cast(sum(case when action_type = '${ACTION.FREESPINS}' and amount_type = ${AMOUNT_TYPE.NON_CASH} then primary_currency_amount else 0 end) as numeric),2) `
            ),
            "noncashCasinoCostFreerounds",
          ],
        ],
        include: [
          {
            model: db.User,
            attributes: [],
            where: { affiliateStatus: true },
          },
        ],
        group: [db.sequelize.col("CasinoTransaction.user_id")],
        raw: true,
      });

      const firstDepositAmount = await db.User.findAll({
        where: { affiliateStatus: true },
        attributes: ["userId"],
        include: [
          {
            model: db.TransactionBanking,
            as: "transactions",
            where: {
              ...dateQueryTransaction,
              actioneeType: ROLE.USER,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              status: TRANSACTION_STATUS.SUCCESS,
            },
            attributes: [
              "actioneeId",
              "primaryCurrencyAmount",
              "transactionBankingId",
            ],
            limit: 1,
            order: [["transactionBankingId", "ASC"]],
          },
        ],
      });

      const bonusAmount = await db.User.findAll({
        where: { affiliateStatus: true },
        attributes: ["userId"],
        include: [
          {
            model: db.UserBonus,
            as: "bonus",
            where: { ...dateQueryBonus },
            attributes: [
              [
                db.sequelize.literal(
                  `ROUND(cast(sum(case when  bonus_type = '${BONUS_TYPE.DEPOSIT}'  then primary_currency_amount else 0 end) as numeric),2) `
                ),
                "depositBonus",
              ],
            ],
          },
        ],
        group: [
          db.sequelize.col("User.user_id"),
          db.sequelize.col("bonus.user_bonus_id"),
        ],
        raw: true,
      });

      Logger.info("Csv worker", { message: "Data fetched from database" });

      return await affiliateTransaction({
        casinoTransactions,
        firstDepositAmount,
        transactions,
        bonusAmount,
      });
    } catch (error) {
      Logger.error("Csv worker", {
        message: "error in worker",
        exception: error,
      });
      return {
        success: false,
        message: "Error in Csv Upload worker",
        data: null,
        error,
      };
    }
  }
}

export default async (job, done) => {
  const result = await MyAffiliateCsvUploadWorker.run({ job });

  if (!result.success) done(new Error("Something went wrong"));
  return done(null, result);
};
