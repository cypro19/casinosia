import Logger from "../../libs/logger";
import "../../libs/setUpGraceFullShutDown";
import WorkerBase from "../../libs/workerBase";
import startElastic from "../../libs/elasticClient";
import { expireBonus } from "../../helpers/bonus.helpers";

class ExpireBonusWorker extends WorkerBase {
  async run() {
    try {
      const { success, elasticClient } = await startElastic();

      await expireBonus(success ? elasticClient : null);

      Logger.info("Expire Bonus", { message: "Bonus Expired Successfully" });

      if (success) {
        await elasticClient?.close();
        Logger.info("Elastic Client", { message: "Elastic Connection Closed" });
      }

      return {
        success: true,
        message: "Bonus Expired Successfully",
        data: { success: true },
        error: null,
      };
    } catch (error) {
      Logger.error("Expire Bonus", {
        message: "error in worker",
        exception: error,
      });
      return {
        success: false,
        message: "Error in Expire Bonus worker",
        data: null,
        error,
      };
    }
  }
}

export default async (job, done) => {
  const result = await ExpireBonusWorker.run({ job });

  if (!result.success) done(new Error("Something went wrong"));
  return done(null, result);
};
