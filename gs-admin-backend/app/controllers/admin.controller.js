import passport from "passport";
import { ERRORS } from "../utils/errors";
import { validateFile } from "../utils/common";
import Responder from "../../server/expressResponder";
import { OK, superadminBaseUrl } from "../utils/constant";
import {
  UploadBannerService,
  GetBannerService,
  UpdateBannerPageService,
  GetBannerKeys,
} from "../services/banner";
import {
  CreateThemesService,
  GetThemeDetailService,
  GetThemesService,
  UpdateThemesService,
} from "../services/themes";
import {
  CreateCurrencyService,
  UpdateCurrencyService,
  GetCurrenciesService,
  GetCurrencyDetailService,
} from "../services/currencies";
import {
  GetCountryListService,
  UpdateRestrictedCountryService,
  GetRestrictedItemsService,
  UpdateRestrictedItemsService,
  DeleteRestrictedItemsService,
  GetUnrestrictedItemsService,
  GetRestrictedCountriesService,
  GetUnrestrictedCountriesService,
  DeleteRestrictedCountriesService,
} from "../services/country";
import {
  CreateSuperadminUser,
  UpdateSuperadminUser,
  GetSuperadminUsers,
  GetSuperadminDetail,
  GetSuperRolesService,
  UpdateStatusService,
  UpdateDailyLimitByExchangeRates,
  GetDailyLimitService,
  UpdateDailyLimitService,
  GetGlobalRegistrationService,
  UpdateGlobalRegistrationService,
  GetDocumentLabelService,
  GetAllGroupService,
  UpdateDocumentLabelService,
  CreateDocumentLabelService,
  GetLoyaltyLevelService,
  UpdateLoyaltyLevelService,
  GetSuperadminChildren,
  UpdateProfileDetail,
  SetSendgridCredentialsService,
} from "../services/superadminUsers";

import {
  CreateCmsPageService,
  UpdateCmsPageService,
  GetAllCmsPageService,
  GetCmsPageService,
  GetCmsDynamicKeys,
  DeleteCmsLanguageService,
} from "../services/cms";

import { GetLanguagesService } from "../services/languages";

export default class AdminController {
  static async loginAdmin(req, res) {
    passport.authenticate("login", (err, superadminDetail) => {
      if (err) {
        return res
          .status(401)
          .json({ message: err.message, errCode: err.code });
      }

      req.login(superadminDetail, (loginErr) => {
        if (loginErr) {
          return res.status(401).send(loginErr);
        }

        delete superadminDetail.password;

        Responder.success(res, {
          accessToken: superadminDetail.accessToken,
          ...superadminDetail,
          message: "Superadmin logged in Successfully!",
        });
      });
    })(req, res);
  }

  static async createAdminUser(req, res) {
    const createSuperadminUserResult = await CreateSuperadminUser.execute(
      req.body
    );

    if (createSuperadminUserResult.successful) {
      Responder.success(res, createSuperadminUserResult.result);
    } else {
      Responder.failed(res, createSuperadminUserResult.errors);
    }
  }

  static async updateAdmin(req, res) {
    const updatedSuperadmin = await UpdateSuperadminUser.execute(req.body);

    if (updatedSuperadmin.successful) {
      Responder.success(res, updatedSuperadmin.result);
    } else {
      Responder.failed(res, updatedSuperadmin.errors);
    }
  }

  static async updateProfile(req, res) {
    const updateProfile = await UpdateProfileDetail.execute(req.body);

    if (updateProfile.successful) {
      Responder.success(res, updateProfile.result);
    } else {
      Responder.failed(res, updateProfile.errors);
    }
  }

  static async getAdminUsers(req, res) {
    const getSuperadminUsersResult = await GetSuperadminUsers.execute({
      ...req.query,
      ...req.body,
    });

    if (getSuperadminUsersResult.successful) {
      Responder.success(res, getSuperadminUsersResult.result);
    } else {
      Responder.failed(res, getSuperadminUsersResult.errors);
    }
  }

  static async getAdminChilds(req, res) {
    const getSuperadminChildsResult = await GetSuperadminChildren.execute({
      ...req.query,
      ...req.body,
    });

    if (getSuperadminChildsResult.successful) {
      Responder.success(res, getSuperadminChildsResult.result);
    } else {
      Responder.failed(res, getSuperadminChildsResult.errors);
    }
  }

  static async getCurrencyDetail(req, res) {
    const getCurrencyDetailResult = await GetCurrencyDetailService.execute(
      req.query
    );

    if (getCurrencyDetailResult.successful) {
      Responder.success(res, getCurrencyDetailResult.result);
    } else {
      Responder.failed(res, getCurrencyDetailResult.errors);
    }
  }

  static async getCurrencies(req, res) {
    const getCurrenciesResult = await GetCurrenciesService.execute(req.query);

    if (getCurrenciesResult.successful) {
      Responder.success(res, getCurrenciesResult.result);
    } else {
      Responder.failed(res, getCurrenciesResult.errors);
    }
  }

  static async createCurrency(req, res) {
    const createCurrencyResult = await CreateCurrencyService.execute(req.body);

    if (createCurrencyResult.successful) {
      Responder.success(res, createCurrencyResult.result);
    } else {
      Responder.failed(res, createCurrencyResult.errors);
    }
  }

  static async updateCurrency(req, res) {
    const updateCurrencyResult = await UpdateCurrencyService.execute(req.body);

    if (updateCurrencyResult.successful) {
      Responder.success(res, updateCurrencyResult.result);
    } else {
      Responder.failed(res, updateCurrencyResult.errors);
    }
  }

  static async getAdminDetail(req, res) {
    const getSuperadminDetail = await GetSuperadminDetail.execute({
      ...req.query,
      ...req.body,
    });

    if (getSuperadminDetail.successful) {
      Responder.success(res, getSuperadminDetail.result);
    } else {
      Responder.failed(res, getSuperadminDetail.errors);
    }
  }

  static async getThemeDetail(req, res) {
    const getThemeDetail = await GetThemeDetailService.execute(req.query);

    if (getThemeDetail.successful) {
      Responder.success(res, getThemeDetail.result);
    } else {
      Responder.failed(res, getThemeDetail.errors);
    }
  }

  static async getThemes(req, res) {
    const getThemes = await GetThemesService.execute(req.query);

    if (getThemes.successful) {
      Responder.success(res, getThemes.result);
    } else {
      Responder.failed(res, getThemes.errors);
    }
  }

  static async updateThemes(req, res) {
    const updateThemes = await UpdateThemesService.execute(req.body);

    if (updateThemes.successful) {
      Responder.success(res, updateThemes.result);
    } else {
      Responder.failed(res, updateThemes.errors);
    }
  }

  static async createThemes(req, res) {
    const createThemes = await CreateThemesService.execute(req.body);

    if (createThemes.successful) {
      Responder.success(res, createThemes.result);
    } else {
      Responder.failed(res, createThemes.errors);
    }
  }

  static async getRoles(req, res) {
    const getSuperRoles = await GetSuperRolesService.execute(req.body);

    if (getSuperRoles.successful) {
      Responder.success(res, getSuperRoles.result);
    } else {
      Responder.failed(res, getSuperRoles.errors);
    }
  }

  static async updateStatus(req, res) {
    let data = { ...req.body };
    const updateStatusResult = await UpdateStatusService.execute(data);

    if (updateStatusResult.successful) {
      Responder.success(res, updateStatusResult.result);
    } else {
      Responder.failed(res, updateStatusResult.errors);
    }
  }

  static async getCountryList(req, res) {
    const getCountryListResult = await GetCountryListService.execute(req.query);

    if (getCountryListResult.successful) {
      Responder.success(res, getCountryListResult.result);
    } else {
      Responder.failed(res, getCountryListResult.errors);
    }
  }

  static async updateRestrictedCountry(req, res) {
    const updateRestrictedCountry =
      await UpdateRestrictedCountryService.execute(req.body);

    if (updateRestrictedCountry.successful) {
      Responder.success(res, updateRestrictedCountry.result);
    } else {
      Responder.failed(res, updateRestrictedCountry.errors);
    }
  }

  static async getRestrictedItems(req, res) {
    const getRestrictedItems = await GetRestrictedItemsService.execute(
      req.query
    );

    if (getRestrictedItems.successful) {
      Responder.success(res, getRestrictedItems.result);
    } else {
      Responder.failed(res, getRestrictedItems.errors);
    }
  }

  static async updateRestrictedItems(req, res) {
    const updateRestrictedItems = await UpdateRestrictedItemsService.execute(
      req.body
    );

    if (updateRestrictedItems.successful) {
      Responder.success(res, updateRestrictedItems.result);
    } else {
      Responder.failed(res, updateRestrictedItems.errors);
    }
  }

  static async deleteRestrictedItems(req, res) {
    const deleteRestrictedItems = await DeleteRestrictedItemsService.execute(
      req.body
    );

    if (deleteRestrictedItems.successful) {
      Responder.success(res, deleteRestrictedItems.result);
    } else {
      Responder.failed(res, deleteRestrictedItems.errors);
    }
  }

  static async getUnrestrictedItems(req, res) {
    const getUnrestrictedItems = await GetUnrestrictedItemsService.execute(
      req.query
    );

    if (getUnrestrictedItems.successful) {
      Responder.success(res, getUnrestrictedItems.result);
    } else {
      Responder.failed(res, getUnrestrictedItems.errors);
    }
  }

  static async getRestrictedCountries(req, res) {
    const getRestrictedCountries = await GetRestrictedCountriesService.execute(
      req.query
    );

    if (getRestrictedCountries.successful) {
      Responder.success(res, getRestrictedCountries.result);
    } else {
      Responder.failed(res, getRestrictedCountries.errors);
    }
  }

  static async getUnrestrictedCountries(req, res) {
    const getUnrestrictedCountries =
      await GetUnrestrictedCountriesService.execute(req.query);

    if (getUnrestrictedCountries.successful) {
      Responder.success(res, getUnrestrictedCountries.result);
    } else {
      Responder.failed(res, getUnrestrictedCountries.errors);
    }
  }

  static async deleteRestrictedCountries(req, res) {
    const deleteRestrictedCountries =
      await DeleteRestrictedCountriesService.execute(req.body);

    if (deleteRestrictedCountries.successful) {
      Responder.success(res, deleteRestrictedCountries.result);
    } else {
      Responder.failed(res, deleteRestrictedCountries.errors);
    }
  }

  static async updateDailyLimitWithExchange(req, res) {
    const updateDailyLimit = await UpdateDailyLimitByExchangeRates.execute(
      req.body
    );

    if (updateDailyLimit.successful) {
      Responder.success(res, updateDailyLimit.result);
    } else {
      Responder.failed(res, updateDailyLimit.errors);
    }
  }

  static async getDailyLimit(req, res) {
    const getDailyLimit = await GetDailyLimitService.execute(req.body);

    if (getDailyLimit.successful) {
      Responder.success(res, getDailyLimit.result);
    } else {
      Responder.failed(res, getDailyLimit.errors);
    }
  }

  static async updateDailyLimit(req, res) {
    const updateDailyLimit = await UpdateDailyLimitService.execute(req.body);

    if (updateDailyLimit.successful) {
      Responder.success(res, updateDailyLimit.result);
    } else {
      Responder.failed(res, updateDailyLimit.errors);
    }
  }

  static async getGlobalRegistration(req, res) {
    const getGlobalRegistration = await GetGlobalRegistrationService.execute();

    if (getGlobalRegistration.successful) {
      Responder.success(res, getGlobalRegistration.result);
    } else {
      Responder.failed(res, getGlobalRegistration.errors);
    }
  }

  static async updateGlobalRegistration(req, res) {
    const updateGlobalRegistration =
      await UpdateGlobalRegistrationService.execute(req.body);

    if (updateGlobalRegistration.successful) {
      Responder.success(res, updateGlobalRegistration.result);
    } else {
      Responder.failed(res, updateGlobalRegistration.errors);
    }
  }

  static async getDocumentLabel(req, res) {
    const getDocumentLabel = await GetDocumentLabelService.execute(req.query);

    if (getDocumentLabel.successful) {
      Responder.success(res, getDocumentLabel.result);
    } else {
      Responder.failed(res, getDocumentLabel.errors);
    }
  }

  static async updateDocumentLabel(req, res) {
    const updateDocumentLabel = await UpdateDocumentLabelService.execute(
      req.body
    );

    if (updateDocumentLabel.successful) {
      Responder.success(res, updateDocumentLabel.result);
    } else {
      Responder.failed(res, updateDocumentLabel.errors);
    }
  }

  static async createDocumentLabel(req, res) {
    const createDocumentLabel = await CreateDocumentLabelService.execute(
      req.body
    );

    if (createDocumentLabel.successful) {
      Responder.success(res, createDocumentLabel.result);
    } else {
      Responder.failed(res, createDocumentLabel.errors);
    }
  }

  static async getLoyaltyLevel(req, res) {
    const getLoyaltyLevel = await GetLoyaltyLevelService.execute({
      ...req.body,
      ...req.query,
    });

    if (getLoyaltyLevel.successful) {
      Responder.success(res, getLoyaltyLevel.result);
    } else {
      Responder.failed(res, getLoyaltyLevel.errors);
    }
  }

  static async updateLoyaltyLevel(req, res) {
    const updateLoyaltyLevel = await UpdateLoyaltyLevelService.execute(
      req.body
    );

    if (updateLoyaltyLevel.successful) {
      Responder.success(res, updateLoyaltyLevel.result);
    } else {
      Responder.failed(res, updateLoyaltyLevel.errors);
    }
  }

  static async getAllGroup(req, res) {
    const getAllGroup = await GetAllGroupService.execute();

    if (getAllGroup.successful) {
      Responder.success(res, getAllGroup.result);
    } else {
      Responder.failed(res, getAllGroup.errors);
    }
  }

  static async setSendgridCredentials(req, res) {
    const sendgridCredentials = await SetSendgridCredentialsService.execute(
      req.body
    );

    if (sendgridCredentials.successful) {
      Responder.success(res, sendgridCredentials.result);
    } else {
      Responder.failed(res, sendgridCredentials.errors);
    }
  }

  static async uploadBanner(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const uploadBannerPage = await UploadBannerService.execute({
      ...req.body,
      image: req.file,
    });

    if (uploadBannerPage.successful) {
      Responder.success(res, uploadBannerPage.result);
    } else {
      Responder.failed(res, uploadBannerPage.errors);
    }
  }

  static async getBanner(req, res) {
    const getBanner = await GetBannerService.execute({
      ...req.body,
      ...req.query,
    });

    if (getBanner.successful) {
      Responder.success(res, getBanner.result);
    } else {
      Responder.failed(res, getBanner.errors);
    }
  }

  static async updateBanner(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const updateBannerPage = await UpdateBannerPageService.execute({
      ...req.body,
      image: req.file,
    });

    if (updateBannerPage.successful) {
      Responder.success(res, updateBannerPage.result);
    } else {
      Responder.failed(res, updateBannerPage.errors);
    }
  }

  static async getBannerKeys(req, res) {
    const getBannerKeys = await GetBannerKeys.execute(req.body);

    if (getBannerKeys.successful) {
      Responder.success(res, getBannerKeys.result);
    } else {
      Responder.failed(res, getBannerKeys.errors);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async getAllCmsPage(req, res) {
    const getAllCmsResult = await GetAllCmsPageService.execute({
      ...req.body,
      ...req.query,
    });

    if (getAllCmsResult.successful) {
      Responder.success(res, getAllCmsResult.result);
    } else {
      Responder.failed(res, getAllCmsResult.errors);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async getCmsPage(req, res) {
    const getCmsResult = await GetCmsPageService.execute({
      ...req.body,
      ...req.query,
    });

    if (getCmsResult.successful) {
      Responder.success(res, getCmsResult.result);
    } else {
      Responder.failed(res, getCmsResult.errors);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async createCmsPage(req, res) {
    const createCmsResult = await CreateCmsPageService.execute(req.body);

    if (createCmsResult.successful) {
      Responder.success(res, createCmsResult.result);
    } else {
      Responder.failed(res, createCmsResult.errors);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async updateCmsPage(req, res) {
    const updateCmsResult = await UpdateCmsPageService.execute({
      ...req.body,
      ...req.query,
    });

    if (updateCmsResult.successful) {
      Responder.success(res, updateCmsResult.result);
    } else {
      Responder.failed(res, updateCmsResult.errors);
    }
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async getCmsDynamicData(req, res) {
    const dynamicKeysDetails = await GetCmsDynamicKeys.execute(req.body);

    if (dynamicKeysDetails.successful) {
      Responder.success(res, dynamicKeysDetails.result);
    } else {
      Responder.failed(res, dynamicKeysDetails.errors);
    }
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async deleteCmsPageLanguage(req, res) {
    const deleteCmsPageLanguage = await DeleteCmsLanguageService.execute(
      req.body
    );

    if (deleteCmsPageLanguage.successful) {
      Responder.success(res, deleteCmsPageLanguage.result);
    } else {
      Responder.failed(res, deleteCmsPageLanguage.errors);
    }
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async getLanguages(req, res) {
    const getLanguages = await GetLanguagesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getLanguages.successful) {
      Responder.success(res, getLanguages.result);
    } else {
      Responder.failed(res, getLanguages.errors);
    }
  }
}
