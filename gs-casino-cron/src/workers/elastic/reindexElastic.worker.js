import db from "../../db/models";
import Logger from "../../libs/logger";
import "../../libs/setUpGraceFullShutDown";
import WorkerBase from "../../libs/workerBase";
import startElastic from "../../libs/elasticClient";
import {
  createElasticDataBanking,
  createElasticDataCasino,
} from "../../helpers/elastic.helpers";

class ElasticReIndexingWorker extends WorkerBase {
  async run() {
    try {
      Logger.info("Elastic Reindex", {
        message: "Starting Re-index pre setup",
      });

      const { elasticClient, success } = await startElastic();

      if (!success) {
        return { success, error: "Unable to connect to elastic" };
      }

      const transactionBanking = await db.TransactionBanking.findAll({
        where: { elasticUpdated: false },
        include: [
          {
            model: db.User,
            as: "transactionUser",
            include: [{ model: db.Wallet, as: "userWallet" }],
          },
        ],
      });

      Logger.info("Elastic Reindex", {
        message: `Banking Transactions Found ${transactionBanking.length}`,
      });

      if (transactionBanking.length !== 0) {
        const bankingPromise = [];

        for (const transaction of transactionBanking) {
          bankingPromise.push(
            createElasticDataBanking({ transaction, elasticClient })
          );
        }

        await Promise.all(bankingPromise);
        Logger.info("Elastic Reindex", {
          message: "Banking Transactions uploaded to Elastic",
        });
      }

      const casinoTransactions = await db.CasinoTransaction.findAll({
        where: { elasticUpdated: false },
        include: [
          { model: db.User, include: [{ model: db.Wallet, as: "userWallet" }] },
        ],
      });

      Logger.info("Elastic Reindex", {
        message: `Casino Transactions Found ${casinoTransactions.length}`,
      });

      if (casinoTransactions.length !== 0) {
        const casinoPromise = [];

        for (const transaction of casinoTransactions) {
          casinoPromise.push(
            createElasticDataCasino({ transaction, elasticClient })
          );
        }

        await Promise.all(casinoPromise);
        Logger.info("Elastic Reindex", {
          message: "Banking Transactions uploaded to Elastic",
        });
      }

      Logger.info("Elastic Reindex", {
        message: "Elastic Re-indexing completed",
      });
      return { success: true, message: "Elastic re-indexing done" };
    } catch (error) {
      Logger.error("Elastic Reindex", {
        message: "Error in Re-index elastic",
        exception: error,
      });
      return {
        success: false,
        message: "Error in Re-index Elastic Worker",
        data: null,
        error,
      };
    }
  }
}

export default async (job, done) => {
  const result = await ElasticReIndexingWorker.run({ job });
  if (!result.success) done(new Error("Something went wrong"));
  return done(null, result);
};
