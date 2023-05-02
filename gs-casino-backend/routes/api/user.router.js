import multer from "multer";
import express from "express";

import { checkDomain } from "../../app/middlewares/checkDomain";
import UserController from "../../app/controllers/user.controller";
import BonusController from "../../app/controllers/bonus.controller";
import CasinoController from "../../app/controllers/casino.controller";
import PaymentController from "../../app/controllers/payment.controller";
import { validateSignature } from "../../app/middlewares/validateSignature";
import { isUserAuthenticated } from "../../app/middlewares/isUserAuthenticated";

const upload = multer();
const args = { mergeParams: true };
const userRouter = express.Router(args);

userRouter.route("/demo-game").post(checkDomain, CasinoController.demoGame);

userRouter.route("/get-top-games").get(checkDomain, UserController.getTopGames); // not tested

userRouter
  .route("/get-all-games")
  .get(checkDomain, CasinoController.getAllGames);

userRouter
  .route("/get-top-winners")
  .get(checkDomain, UserController.getTopWinners); // not tested

userRouter
  .route("/get-current-winners")
  .get(checkDomain, UserController.getCurrentWinners); // not tested

userRouter
  .route("/check-unique-constraints")
  .get(checkDomain, UserController.checkEmailUsername);

userRouter
  .route("/insert-unique-key")
  .post(checkDomain, UserController.insertUniqueUserIdentification);

userRouter
  .route("/init-pay")
  .get(isUserAuthenticated, PaymentController.initPay); // done

userRouter
  .route("/avail-bonus")
  .post(isUserAuthenticated, BonusController.availBonus); // done

userRouter
  .route("/set-loss-limit")
  .post(isUserAuthenticated, UserController.setLossLimit);

userRouter
  .route("/get-user-bonus")
  .get(isUserAuthenticated, BonusController.getUserBonus);

userRouter
  .route("/get-limit-table")
  .get(isUserAuthenticated, UserController.getLimitTable);

userRouter
  .route("/set-daily-limit")
  .post(isUserAuthenticated, UserController.setDailyLimit);

userRouter
  .route("/set-session-time")
  .post(isUserAuthenticated, UserController.setTimeLimit);

userRouter
  .route("/get-user-details")
  .get(isUserAuthenticated, UserController.getUserDetails);

userRouter
  .route("/set-deposit-limit")
  .post(isUserAuthenticated, UserController.setDepositLimit);

userRouter
  .route("/set-disable-until")
  .post(isUserAuthenticated, UserController.setDisableUntil);

userRouter
  .route("/init-game")
  .post(checkDomain, isUserAuthenticated, CasinoController.initGame);

userRouter
  .route("/get-account-detail")
  .get(isUserAuthenticated, UserController.getAccountDetail);

userRouter
  .route("/add-favorite-game")
  .post(isUserAuthenticated, CasinoController.addFavoriteGame);

userRouter
  .route("/get-favorite-games")
  .get(isUserAuthenticated, CasinoController.getFavoriteGame);

userRouter
  .route("/get-loyalty-details")
  .get(isUserAuthenticated, UserController.getLoyaltyDetails);

userRouter
  .route("/update-user-details")
  .put(isUserAuthenticated, UserController.updateUserDetails);

userRouter
  .route("/remove-profile-image")
  .put(isUserAuthenticated, UserController.removeProfileImage);

userRouter
  .route("/cancel-bonus")
  .delete(checkDomain, isUserAuthenticated, BonusController.cancelBonus); // done

userRouter
  .route("/get-user-transactions")
  .get(isUserAuthenticated, UserController.getUserTransactions);

userRouter
  .route("/get-withdraw-requests")
  .get(isUserAuthenticated, UserController.getWithdrawRequests); // done

userRouter
  .route("/activate-bonus")
  .put(checkDomain, isUserAuthenticated, BonusController.activateBonus); // done

userRouter
  .route("/remove-favorite-game")
  .delete(isUserAuthenticated, CasinoController.removeFavoriteGame);

userRouter
  .route("/get-casino-transactions")
  .get(isUserAuthenticated, CasinoController.getCasinoTransactions);

userRouter
  .route("/cancel-withdraw-request")
  .put(checkDomain, isUserAuthenticated, UserController.cancelWithdrawRequest); // done

userRouter
  .route("/upload-profile-image")
  .put(
    upload.single("profileImage"),
    isUserAuthenticated,
    UserController.uploadProfileImage
  );

// Micro services routes
userRouter
  .route("/cancel-free-spins")
  .post(validateSignature, UserController.cancelFreespins); // done

userRouter
  .route("/live-update-wallet")
  .post(validateSignature, UserController.liveUpdateWallet); // done

export { userRouter };
