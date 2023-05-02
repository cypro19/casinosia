import { sendResponse } from "../../helpers/response.helpers";
import {
  cronQueue,
  JOB_AFFILIATE_CSV_UPLOAD,
  JOB_EXPIRE_BONUS,
  JOB_PAYMENT_UPDATE_TRANSACTION,
  JOB_REINDEX_ELASTIC,
  JOB_RESET_LOGIN_COUNT,
} from "../../queues/cron.queue";
import Logger from "../../libs/logger";

export default class CronController {
  static async startMyAffiliateCsvUpload(req, res, next) {
    try {
      cronQueue.add(JOB_AFFILIATE_CSV_UPLOAD, {
        priority: 1,
      });

      Logger.info("Cron Controller", {
        message: `------- JOB ${JOB_AFFILIATE_CSV_UPLOAD} Started`,
      });

      sendResponse(
        { req, res, next },
        {
          result: {
            success: true,
            message: "My Affiliate Csv upload cron added",
          },
          successful: true,
          serviceErrors: null,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async startResetLoginCount(req, res, next) {
    try {
      cronQueue.add(JOB_RESET_LOGIN_COUNT, {
        priority: 1,
      });

      Logger.info("Cron Controller", {
        message: `------- JOB ${JOB_RESET_LOGIN_COUNT} Started`,
      });

      sendResponse(
        { req, res, next },
        {
          result: { success: true, message: "Reset Login Count cron added" },
          successful: true,
          serviceErrors: null,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async startReIndexElastic(req, res, next) {
    try {
      cronQueue.add(JOB_REINDEX_ELASTIC, {
        priority: 1,
      });

      Logger.info("Cron Controller", {
        message: `------- JOB ${JOB_REINDEX_ELASTIC} Started`,
      });

      sendResponse(
        { req, res, next },
        {
          result: { success: true, message: "Re-index Elastic cron added" },
          successful: true,
          serviceErrors: null,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async startExpireBonus(req, res, next) {
    try {
      cronQueue.add(JOB_EXPIRE_BONUS, {
        priority: 1,
      });

      Logger.info("Cron Controller", {
        message: `------- JOB ${JOB_EXPIRE_BONUS} Started`,
      });

      sendResponse(
        { req, res, next },
        {
          result: { success: true, message: "Expire Bonus cron added" },
          successful: true,
          serviceErrors: null,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async startUpdateTransaction(req, res, next) {
    try {
      cronQueue.add(JOB_PAYMENT_UPDATE_TRANSACTION, {
        priority: 1,
      });

      Logger.info("Cron Controller", {
        message: `------- JOB ${JOB_PAYMENT_UPDATE_TRANSACTION} Started`,
      });

      sendResponse(
        { req, res, next },
        {
          result: {
            success: true,
            message: "Payment update transaction cron added",
          },
          successful: true,
          serviceErrors: null,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
