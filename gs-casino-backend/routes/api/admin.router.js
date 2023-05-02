import express from "express";

import { checkDomain } from "../../app/middlewares/checkDomain";
import BonusController from "../../app/controllers/bonus.controller";
import AdminController from "../../app/controllers/admin.controller";
import CasinoController from "../../app/controllers/casino.controller";

const args = { mergeParams: true };
const adminRouter = express.Router(args);

adminRouter.route("/get-cms-page").get(checkDomain, AdminController.getCmsPage);

adminRouter
  .route("/get-all-bonus")
  .get(checkDomain, BonusController.getAllBonus);

adminRouter
  .route("/get-languages")
  .get(checkDomain, AdminController.getLanguages);

adminRouter
  .route("/get-currencies")
  .get(checkDomain, AdminController.getCurrencies);

adminRouter
  .route("/get-all-country")
  .get(checkDomain, AdminController.getAllCountry);

adminRouter
  .route("/get-bonus-detail")
  .get(checkDomain, BonusController.getBonusDetail);

adminRouter
  .route("/get-loyalty-level")
  .get(checkDomain, AdminController.getLoyaltyLevel);

adminRouter
  .route("/get-game-category")
  .get(checkDomain, CasinoController.getGameCategory);

adminRouter
  .route("/get-game-provider")
  .get(checkDomain, CasinoController.getGameProvider);

adminRouter
  .route("/get-category-games")
  .get(checkDomain, CasinoController.getCategoryGames);

adminRouter
  .route("/get-game-sub-category")
  .get(checkDomain, CasinoController.getGameSubCategory);

adminRouter
  .route("/get-registration-fields")
  .get(checkDomain, AdminController.getRegistrationFields);

export { adminRouter };
