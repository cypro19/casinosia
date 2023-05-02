import express from "express";
import { isAuthenticated } from "../../app/middlewares/isAuthenticated";
import SwissSoftController from "../../app/controllers/swissSoft.controller";

const args = { mergeParams: true };
const swissSoftRouter = express.Router(args);

swissSoftRouter
  .route("/rollback")
  .post(isAuthenticated, SwissSoftController.rollback);

swissSoftRouter
  .route("/play")
  .post(isAuthenticated, SwissSoftController.playService);

swissSoftRouter
  .route("/freespins")
  .post(isAuthenticated, SwissSoftController.freeSpins);

swissSoftRouter.route("/test-play").post(SwissSoftController.playService);

export { swissSoftRouter };
