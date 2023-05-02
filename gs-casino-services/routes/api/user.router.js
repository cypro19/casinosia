import express from "express";
import { validateSignature } from "../../app/middlewares/validateSignature";
import UserController from "../../app/controllers/user.controller";

const args = { mergeParams: true };
const userRouter = express.Router(args);

userRouter.route("/demo").post(validateSignature, UserController.demoGame);

userRouter.route("/init").post(validateSignature, UserController.initGame);

userRouter
  .route("/issue-freeSpins")
  .post(validateSignature, UserController.issueFreeSpin);

userRouter
  .route("/cancel-freeSpins")
  .post(validateSignature, UserController.cancelFreeSpins);

userRouter
  .route("/roundDetail")
  .post(validateSignature, UserController.roundDetails);

export { userRouter };
