import db from "../db/models";
import { Op } from "sequelize";
import Logger from "../libs/logger";
import { FAILED, TRANSACTION_STATUS } from "../libs/constants";

export const updateTransactions = async (elasticClient) => {
  Logger.info("Update Transactions", { message: "Getting Users" });

  const date = new Date(Date.now());

  const users = await db.User.findAll({
    include: [
      {
        model: db.TransactionBanking,
        as: "transactions",
        where: {
          status: TRANSACTION_STATUS.PENDING,
          paymentTransactionId: { [Op.is]: null },
          [Op.and]: [
            db.Sequelize.where(
              db.Sequelize.fn(
                "date",
                db.Sequelize.col("transactions.created_at")
              ),
              "=",
              new Date(date.setDate(date.getDate() - 4))
            ),
          ],
        },
        required: false,
      },
    ],
  });

  Logger.info("Update Transactions", { message: `User Count ${users.length}` });

  if (users) {
    for (const user of users) {
      if (user.transactions.length) {
        for (const transaction of user.transactions) {
          await transaction.update(
            { status: TRANSACTION_STATUS.FAILED },
            { options: { statusValue: FAILED, elasticClient } }
          );
        }
      }
    }
  }
};
