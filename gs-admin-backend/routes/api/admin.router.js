import multer from "multer";
import express from "express";
import UserController from "../../app/controllers/user.controller";
import BonusController from "../../app/controllers/bonus.controller";
import CasinoController from "../../app/controllers/casino.controller";
import WalletController from "../../app/controllers/wallet.controller";
import ReportController from "../../app/controllers/report.controller";
import AdminController from "../../app/controllers/admin.controller";
import EmailTemplateController from "../../app/controllers/email.controller";
import LanguageController from "../../app/controllers/language.controller";
import {
  isAuthenticate,
  checkPermission,
  isAuthenticated,
} from "../../app/middlewares";

const args = { mergeParams: true };
const adminRouter = express.Router(args);
const upload = multer();

adminRouter.route("/login").post(AdminController.loginAdmin);

adminRouter
  .route("/admin-details")
  .get(isAuthenticate, AdminController.getAdminDetail);

adminRouter.route("/create-admin-user").post(AdminController.createAdminUser);

adminRouter
  .route("/update-admin-user")
  .put(isAuthenticate, checkPermission, AdminController.updateAdmin);

adminRouter
  .route("/update-profile")
  .put(isAuthenticate, AdminController.updateProfile);

adminRouter
  .route("/get-admins")
  .get(isAuthenticate, AdminController.getAdminUsers);

adminRouter
  .route("/get-admin-childs")
  .get(isAuthenticate, AdminController.getAdminChilds);

adminRouter
  .route("/get-currency-details")
  .get(isAuthenticate, checkPermission, AdminController.getCurrencyDetail);

adminRouter
  .route("/get-currencies")
  .get(isAuthenticate, AdminController.getCurrencies);

adminRouter
  .route("/create-currency")
  .post(isAuthenticate, checkPermission, AdminController.createCurrency);

adminRouter
  .route("/update-currency")
  .put(isAuthenticate, checkPermission, AdminController.updateCurrency);

adminRouter
  .route("/get-theme-details")
  .get(isAuthenticate, checkPermission, AdminController.getThemeDetail);

adminRouter.route("/get-themes").get(isAuthenticate, AdminController.getThemes);

adminRouter
  .route("/create-theme")
  .post(isAuthenticate, checkPermission, AdminController.createThemes);

adminRouter
  .route("/update-theme")
  .put(isAuthenticate, checkPermission, AdminController.updateThemes);

adminRouter.route("/get-roles").get(isAuthenticate, AdminController.getRoles);

adminRouter
  .route("/update-status")
  .put(isAuthenticate, AdminController.updateStatus);

adminRouter
  .route("/update-restricted-country")
  .put(
    isAuthenticate,
    checkPermission,
    AdminController.updateRestrictedCountry
  );

adminRouter
  .route("/get-restricted-items")
  .get(isAuthenticate, checkPermission, AdminController.getRestrictedItems);

adminRouter
  .route("/update-restricted-items")
  .put(isAuthenticate, checkPermission, AdminController.updateRestrictedItems);

adminRouter
  .route("/delete-restricted-items")
  .put(isAuthenticate, checkPermission, AdminController.deleteRestrictedItems);

adminRouter
  .route("/get-unrestricted-items")
  .get(isAuthenticate, checkPermission, AdminController.getUnrestrictedItems);

adminRouter
  .route("/get-restricted-countries")
  .get(isAuthenticate, AdminController.getRestrictedCountries);

adminRouter
  .route("/get-unrestricted-countries")
  .get(isAuthenticate, AdminController.getUnrestrictedCountries);

adminRouter
  .route("/delete-restricted-countries")
  .put(
    isAuthenticate,
    checkPermission,
    AdminController.deleteRestrictedCountries
  );

adminRouter
  .route("/get-cms")
  .get(isAuthenticate, checkPermission, AdminController.getAllCmsPage);

adminRouter
  .route("/get-cms-details")
  .get(isAuthenticate, checkPermission, AdminController.getCmsPage);

adminRouter
  .route("/create-cms")
  .post(isAuthenticate, checkPermission, AdminController.createCmsPage);

adminRouter
  .route("/update-cms")
  .put(isAuthenticate, checkPermission, AdminController.updateCmsPage);

adminRouter.route("/get-users").get(isAuthenticate, UserController.getUsers);
adminRouter
  .route("/create-user")
  .post(isAuthenticate, checkPermission, UserController.createUser);
adminRouter
  .route("/convert-amount")
  .get(isAuthenticate, BonusController.convertAmount);

adminRouter
  .route("/create-bonus")
  .post(
    upload.single("bonusImage"),
    isAuthenticate,
    checkPermission,
    BonusController.createBonus
  );

adminRouter
  .route("/update-bonus")
  .put(
    upload.single("bonusImage"),
    isAuthenticate,
    checkPermission,
    BonusController.updateBonus
  );

adminRouter
  .route("/delete-bonus")
  .delete(isAuthenticate, checkPermission, BonusController.deleteBonus);

adminRouter
  .route("/get-bonus")
  .get(isAuthenticate, BonusController.getAllBonus);

adminRouter
  .route("/get-kpi-summary")
  .get(isAuthenticate, checkPermission, ReportController.getKPIReport);

adminRouter
  .route("/get-freespin-games")
  .get(isAuthenticate, checkPermission, CasinoController.getFreespinGames);

adminRouter
  .route("/issue-bonus")
  .post(isAuthenticate, checkPermission, BonusController.issueBonus);

adminRouter
  .route("/cancel-bonus")
  .put(isAuthenticate, checkPermission, BonusController.cancelBonus);

adminRouter
  .route("/get-user-bonus")
  .get(isAuthenticate, checkPermission, BonusController.getUserBonus);

adminRouter
  .route("/get-balance-bonuses")
  .get(isAuthenticate, BonusController.getBalanceBonus);

adminRouter
  .route("/create-wagering-template")
  .post(
    isAuthenticate,
    checkPermission,
    BonusController.createWageringTemplate
  );

adminRouter
  .route("/update-wagering-template")
  .put(isAuthenticate, checkPermission, BonusController.updateWageringTemplate);

adminRouter
  .route("/get-all-wagering-templates")
  .get(isAuthenticate, BonusController.getAllWageringTemplates);

adminRouter
  .route("/get-wagering-templates")
  .get(isAuthenticate, BonusController.getWageringTemplates);

adminRouter
  .route("/get-template-details")
  .get(isAuthenticate, BonusController.getWageringTemplateDetails);

adminRouter
  .route("/get-payment-methods")
  .get(isAuthenticate, BonusController.getPaymentMethods);

adminRouter.route("/get-user").get(isAuthenticate, UserController.getUser);

adminRouter
  .route("/get-wallets")
  .get(isAuthenticate, WalletController.getWallet);

adminRouter
  .route("/create-document-label")
  .post(isAuthenticate, checkPermission, AdminController.createDocumentLabel);

adminRouter
  .route("/get-document-label")
  .get(isAuthenticate, AdminController.getDocumentLabel);

adminRouter
  .route("/update-document-label")
  .put(isAuthenticate, checkPermission, AdminController.updateDocumentLabel);

adminRouter
  .route("/get-user-document")
  .get(isAuthenticate, checkPermission, UserController.getUserDocument);

adminRouter
  .route("/verify-user-document")
  .put(isAuthenticate, checkPermission, UserController.verifyUserDocument);

adminRouter
  .route("/request-document")
  .put(isAuthenticate, checkPermission, UserController.requestDocument);

adminRouter
  .route("/cancel-document-request")
  .put(isAuthenticate, checkPermission, UserController.cancelDocumentRequest);

adminRouter
  .route("/get-country-list")
  .get(isAuthenticate, AdminController.getCountryList);

adminRouter
  .route("/create-casino-category")
  .post(isAuthenticate, checkPermission, CasinoController.createGameCategory);
adminRouter
  .route("/get-all-providers")
  .get(isAuthenticate, CasinoController.getAllProviders);
adminRouter
  .route("/create-casino-provider")
  .post(
    upload.single("thumbnail"),
    isAuthenticate,
    checkPermission,
    CasinoController.createMasterCasinoProvider
  );
adminRouter
  .route("/update-casino-provider")
  .put(
    upload.single("thumbnail"),
    isAuthenticate,
    checkPermission,
    CasinoController.updateMasterCasinoProvider
  );
adminRouter
  .route("/get-casino-providers")
  .get(isAuthenticate, CasinoController.getMasterCasinoProvider);
adminRouter
  .route("/update-casino-category")
  .put(isAuthenticate, checkPermission, CasinoController.updateGameCategory);
adminRouter
  .route("/order-casino-category")
  .put(isAuthenticate, checkPermission, CasinoController.orderGameCategory);
adminRouter
  .route("/delete-category-game")
  .delete(isAuthenticate, checkPermission, CasinoController.deleteCategoryGame);
adminRouter
  .route("/order-category-games")
  .put(isAuthenticate, checkPermission, CasinoController.orderCategoryGames);

adminRouter
  .route("/create-casino-game")
  .post(
    upload.single("thumbnail"),
    isAuthenticate,
    checkPermission,
    CasinoController.createCasinoGame
  );
adminRouter
  .route("/create-casino-sub-category")
  .post(
    isAuthenticate,
    checkPermission,
    CasinoController.createGameSubCategory
  );
adminRouter
  .route("/order-casino-sub-category")
  .put(isAuthenticate, checkPermission, CasinoController.orderSubGameCategory);
adminRouter
  .route("/delete-casino-category")
  .delete(isAuthenticate, checkPermission, CasinoController.deleteGameCategory);
adminRouter
  .route("/delete-casino-sub-category")
  .delete(isAuthenticate, CasinoController.deleteGameSubCategory);
adminRouter
  .route("/update-casino-sub-category")
  .put(isAuthenticate, checkPermission, CasinoController.updateGameSubCategory);

adminRouter
  .route("/create-category-game")
  .post(isAuthenticate, checkPermission, CasinoController.createCategoryGame);

adminRouter
  .route("/update-category-game")
  .put(
    upload.single("thumbnail"),
    isAuthenticate,
    checkPermission,
    CasinoController.updateCategoryGame
  );

adminRouter
  .route("/get-category-games")
  .get(isAuthenticate, CasinoController.getCategoryGames);

adminRouter
  .route("/get-casino-games")
  .get(isAuthenticate, CasinoController.getCasinoGame);

adminRouter
  .route("/get-all-casino-games")
  .get(isAuthenticate, CasinoController.getAllCasinoGame);

adminRouter
  .route("/load-casino-game")
  .post(
    upload.single("gameData"),
    isAuthenticate,
    CasinoController.loadCasinoGame
  );

adminRouter
  .route("/update-casino-game")
  .put(
    upload.single("thumbnail"),
    isAuthenticate,
    checkPermission,
    CasinoController.updateCasinoGame
  );

adminRouter
  .route("/get-all-casino-games")
  .get(isAuthenticate, CasinoController.getAllCasinoGame);

adminRouter
  .route("/get-aggregators")
  .get(isAuthenticate, CasinoController.getAggregators);

adminRouter
  .route("/add-aggregator")
  .post(isAuthenticate, checkPermission, CasinoController.createAggregator);

adminRouter
  .route("/update-master-game-sub-category")
  .put(
    isAuthenticate,
    checkPermission,
    CasinoController.updateMasterGameSubCategory
  );

adminRouter
  .route("/update-master-game-category")
  .put(
    isAuthenticate,
    checkPermission,
    CasinoController.updateMasterGameCategory
  );

adminRouter
  .route("/get-all-casino-sub-category")
  .get(isAuthenticate, CasinoController.getAllGameSubCategory);

adminRouter
  .route("/get-all-casino-category")
  .get(isAuthenticate, CasinoController.getGameCategory);
adminRouter
  .route("/get-casino-sub-category")
  .get(isAuthenticate, CasinoController.getGameSubCategory);

adminRouter
  .route("/get-transactions")
  .get(isAuthenticate, checkPermission, WalletController.getTransactionDetails);

adminRouter
  .route("/get-transaction-users")
  .get(isAuthenticate, checkPermission, WalletController.getTransactionUsers);

adminRouter
  .route("/update-daily-limit-with-exchange")
  .put(isAuthenticate, AdminController.updateDailyLimitWithExchange);

adminRouter
  .route("/get-daily-limit")
  .get(isAuthenticate, AdminController.getDailyLimit);

adminRouter
  .route("/update-daily-limit")
  .put(isAuthenticate, AdminController.updateDailyLimit);

adminRouter
  .route("/get-casino-transactions")
  .get(isAuthenticate, checkPermission, CasinoController.getCasinoTransactions);

adminRouter
  .route("/get-all-withdraw-request")
  .get(isAuthenticate, checkPermission, UserController.getAllWithdrawRequest);

adminRouter
  .route("/get-global-registration")
  .get(isAuthenticate, AdminController.getGlobalRegistration);

adminRouter
  .route("/update-global-registration")
  .put(
    isAuthenticate,
    checkPermission,
    AdminController.updateGlobalRegistration
  );

adminRouter
  .route("/get-demographic-report")
  .get(isAuthenticate, checkPermission, ReportController.getDemographicReport);

adminRouter
  .route("/get-live-player-report")
  .get(isAuthenticate, checkPermission, ReportController.getLivePlayerReport);

adminRouter
  .route("/get-bonus-detail")
  .get(isAuthenticate, checkPermission, BonusController.getBonusDetail);

adminRouter
  .route("/get-top-players")
  .get(isAuthenticate, checkPermission, ReportController.getTopTen);

adminRouter
  .route("/get-players-liability")
  .get(
    isAuthenticate,
    checkPermission,
    ReportController.getPlayerLiabilityReport
  );

adminRouter
  .route("/get-kpi-report")
  .get(isAuthenticate, checkPermission, ReportController.getKPIProviderReport);

adminRouter
  .route("/get-game-report")
  .get(isAuthenticate, checkPermission, ReportController.getGameReport);

adminRouter
  .route("/get-loyalty-level")
  .get(isAuthenticate, AdminController.getLoyaltyLevel);

adminRouter
  .route("/update-loyalty-level")
  .put(isAuthenticate, AdminController.updateLoyaltyLevel);

adminRouter
  .route("/get-all-group")
  .get(isAuthenticate, AdminController.getAllGroup);

adminRouter
  .route("/set-daily-limit")
  .post(isAuthenticate, checkPermission, UserController.setDailyLimit);

adminRouter
  .route("/set-loss-limit")
  .post(isAuthenticate, checkPermission, UserController.setLossLimit);

adminRouter
  .route("/set-deposit-limit")
  .post(isAuthenticate, checkPermission, UserController.setDepositLimit);

adminRouter
  .route("/set-disable-until")
  .post(isAuthenticate, checkPermission, UserController.setDisableUntil);

adminRouter
  .route("/set-session-time")
  .post(isAuthenticate, checkPermission, UserController.setTimeLimit);

adminRouter
  .route("/set-email-credentials")
  .put(isAuthenticate, AdminController.setSendgridCredentials);

adminRouter
  .route("/get-all-email-templates")
  .get(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.getAllEmailTemplate
  );

adminRouter
  .route("/get-email-template")
  .get(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.getEmailTemplateById
  );

adminRouter
  .route("/update-email-template")
  .put(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.updateEmailTemplate
  );

adminRouter
  .route("/test-email-template")
  .post(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.testEmailTemplate
  );

adminRouter
  .route("/email-dynamic-data")
  .get(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.getEmailDynamicData
  );

adminRouter
  .route("/delete-email-template-language")
  .delete(isAuthenticate, EmailTemplateController.deleteEmailTemplateLanguage);

adminRouter
  .route("/get-image-gallery")
  .get(isAuthenticate, checkPermission, EmailTemplateController.getGallery);

adminRouter
  .route("/upload-to-gallery")
  .put(
    upload.single("image"),
    isAuthenticate,
    checkPermission,
    EmailTemplateController.uploadImageGallery
  );

adminRouter
  .route("/delete-gallery-image")
  .delete(isAuthenticate, checkPermission, EmailTemplateController.deleteImage);

adminRouter.route("/add-tags").put(isAuthenticated, UserController.addTags);

adminRouter
  .route("/delete-tags")
  .delete(isAuthenticated, UserController.deleteTags);

adminRouter
  .route("/get-languages")
  .get(isAuthenticate, LanguageController.getLanguages);

adminRouter
  .route("/load-language-file")
  .post(
    upload.single("languageCsv"),
    isAuthenticate,
    LanguageController.loadLanguageCsv
  );

adminRouter
  .route("/get-language-support-keys")
  .get(isAuthenticate, LanguageController.getLanguageSupportKeys);

adminRouter
  .route("/add-balance")
  .put(isAuthenticate, checkPermission, WalletController.addBalance);

adminRouter
  .route("/cms-dynamic-data")
  .get(isAuthenticate, checkPermission, AdminController.getCmsDynamicData);

adminRouter
  .route("/delete-cms-language")
  .delete(isAuthenticate, AdminController.deleteCmsPageLanguage);

adminRouter
  .route("/banner-keys")
  .get(isAuthenticate, AdminController.getBannerKeys);

adminRouter
  .route("/upload-banner")
  .post(upload.single("image"), isAuthenticate, AdminController.uploadBanner);

adminRouter.route("/get-banner").get(isAuthenticate, AdminController.getBanner);

adminRouter
  .route("/update-banner")
  .put(upload.single("image"), isAuthenticate, AdminController.updateBanner);

adminRouter
  .route("/get-languages")
  .get(isAuthenticate, AdminController.getLanguages);

adminRouter
  .route("/elastic-health-check")
  .get(isAuthenticate, ReportController.elasticHealthCheck);

//----------------CRM Routes
adminRouter
  .route("/create-email-template")
  .post(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.createEmailTemplate
  );
adminRouter
  .route("/get-all-email-templates")
  .get(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.getAllEmailTemplate
  );
adminRouter
  .route("/get-email-template")
  .get(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.getEmailTemplateById
  );
adminRouter
  .route("/update-email-template")
  .put(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.updateEmailTemplate
  );
adminRouter
  .route("/mark-email-primary")
  .post(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.markEmailPrimary
  );
adminRouter
  .route("/delete-email-template")
  .delete(
    isAuthenticate,
    checkPermission,
    EmailTemplateController.deleteEmailTemplate
  );
adminRouter
  .route("/delete-email-template-language")
  .delete(isAuthenticate, EmailTemplateController.deleteEmailTemplateLanguage);
adminRouter
  .route("/get-image-gallery")
  .get(isAuthenticate, checkPermission, EmailTemplateController.getGallery);
adminRouter
  .route("/delete-gallery-image")
  .delete(isAuthenticate, checkPermission, EmailTemplateController.deleteImage);

export { adminRouter };
