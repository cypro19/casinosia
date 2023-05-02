import db from "../../db/models";
import Logger from "../../libs/logger";
import "../../libs/setUpGraceFullShutDown";
import WorkerBase from "../../libs/workerBase";

class ResetLoginCountWorker extends WorkerBase {
  async run() {
    try {
      await db.User.update(
        { loggedIn: 0 },
        { where: { isEmailVerified: true } }
      );

      Logger.info("Elastic login reset worker", {
        message: "Login count reset done",
      });
      return {
        success: true,
        message: "Login count reset done",
        data: { success: true },
        error: null,
      };
    } catch (error) {
      Logger.error("Elastic login reset worker", {
        message: "Error in Reset Login Count",
        exception: error,
      });
      return {
        success: false,
        message: "Error in Reset Login Count Worker",
        data: null,
        error,
      };
    }
  }
}

export default async (job, done) => {
  const result = await ResetLoginCountWorker.run({ job });
  if (!result.success) done(new Error("Something went wrong"));
  return done(null, result);
};
