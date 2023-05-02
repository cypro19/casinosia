import express from "express";
import PaymentController from "../../app/controllers/payment.controller";
import { isMerchantAuthenticated } from "../../app/middlewares/isMerchantAuthenticated";

const args = { mergeParams: true };
const paymentRouter = express.Router(args);

paymentRouter
  .route("/verifyuser")
  .post(isMerchantAuthenticated, PaymentController.verifyUser); // done

paymentRouter
  .route("/authorize")
  .post(isMerchantAuthenticated, PaymentController.authorize); // done

paymentRouter
  .route("/transfer")
  .post(isMerchantAuthenticated, PaymentController.transfer); // done

paymentRouter
  .route("/cancel")
  .post(isMerchantAuthenticated, PaymentController.cancel); // done

export { paymentRouter };
