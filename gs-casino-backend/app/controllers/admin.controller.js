import { GetCmsPageService } from "../services/cms";
import Responder from "../../server/expressResponder";
import { GetAllCountriesService } from "../services/country";
import {
  GetRegistrationFieldService,
  GetLoyaltyLevelService,
  GetLanguageService,
  GetCurrenciesService,
} from "../services/admin";

export default class AdminController {
  static async getCurrencies(req, res) {
    const getCurrencies = await GetCurrenciesService.execute(req.body);

    if (getCurrencies.successful) {
      Responder.success(res, getCurrencies.result);
    } else {
      Responder.failed(res, getCurrencies.errors);
    }
  }

  static async getRegistrationFields(req, res) {
    const getRegistrationFieldResult =
      await GetRegistrationFieldService.execute(req.body);

    if (getRegistrationFieldResult.successful) {
      Responder.success(res, getRegistrationFieldResult.result);
    } else {
      Responder.failed(res, getRegistrationFieldResult.errors);
    }
  }

  static async getAllCountry(req, res) {
    const getAllCountryResult = await GetAllCountriesService.execute();

    if (getAllCountryResult.successful) {
      Responder.success(res, getAllCountryResult.result);
    } else {
      Responder.failed(res, getAllCountryResult.errors);
    }
  }

  static async getLoyaltyLevel(req, res) {
    const getLoyaltyLevel = await GetLoyaltyLevelService.execute(req.body);

    if (getLoyaltyLevel.successful) {
      Responder.success(res, getLoyaltyLevel.result);
    } else {
      Responder.failed(res, getLoyaltyLevel.errors);
    }
  }

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

  static async getLanguages(req, res) {
    const getLanguages = await GetLanguageService.execute(req.body);

    if (getLanguages.successful) {
      Responder.success(res, getLanguages.result);
    } else {
      Responder.failed(res, getLanguages.errors);
    }
  }
}
