import Logger from "../../libs/logger";
import "../../libs/setUpGraceFullShutDown";
import WorkerBase from "../../libs/workerBase";
import startElastic from "../../libs/elasticClient";
import { updateTransactions } from "../../helpers/payment.helpers";

class UpdateTransactionsWorker extends WorkerBase {
  async run() {
    try {
      const { success, elasticClient } = await startElastic();

      await updateTransactions(success ? elasticClient : null);

      Logger.info("Update Transactions", {
        message: "Transactions Updated Successfully",
      });

      if (success) {
        await elasticClient?.close();
        Logger.info("Elastic Client", { message: "Elastic Connection Closed" });
      }

      return {
        success: true,
        message: "Transactions Updated Successfully",
        data: { success: true },
        error: null,
      };
    } catch (error) {
      Logger.error("Update Transactions", {
        message: "error in worker",
        exception: error,
      });
      return {
        success: false,
        message: "Error in Update Transactions worker",
        data: null,
        error,
      };
    }
  }
}

export default async (job, done) => {
  const result = await UpdateTransactionsWorker.run({ job });

  if (!result.success) done(new Error("Something went wrong"));
  return done(null, result);
};
