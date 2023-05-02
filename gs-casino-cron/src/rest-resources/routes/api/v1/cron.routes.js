import express from "express";
import CronController from "../../../controllers/cron.controller";
import requestValidationMiddleware from "../../../middlewares/requestValidation.middleware";
import responseValidationMiddleware from "../../../middlewares/responseValidation.middleware";

const cronRouts = express.Router();

cronRouts
  .route("/start-csv-upload")
  .post(
    requestValidationMiddleware({}),
    CronController.startMyAffiliateCsvUpload,
    responseValidationMiddleware({})
  );

cronRouts
  .route("/start-reset-login-count")
  .post(
    requestValidationMiddleware({}),
    CronController.startResetLoginCount,
    responseValidationMiddleware({})
  );

cronRouts
  .route("/start-re-index-elastic")
  .post(
    requestValidationMiddleware({}),
    CronController.startReIndexElastic,
    responseValidationMiddleware({})
  );

cronRouts
  .route("/start-expire-bonus")
  .post(
    requestValidationMiddleware({}),
    CronController.startExpireBonus,
    responseValidationMiddleware({})
  );

cronRouts
  .route("/start-payment-update-transactions")
  .post(
    requestValidationMiddleware({}),
    CronController.startUpdateTransaction,
    responseValidationMiddleware({})
  );
export default cronRouts;
