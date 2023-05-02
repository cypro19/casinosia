import Responder from "../../server/expressResponder";
import {
  CreateAffiliateService,
  GetAffiliateService,
  GetAffiliatesService,
  UpdateAffiliateService,
  GetTransactionAffiliateService,
} from "../services/affiliate";

export default class AffiliateController {
  static async getAffiliateDetails(req, res) {
    const affiliateDetails = await GetAffiliateService.execute({
      ...req.body,
      ...req.query,
    });

    if (affiliateDetails.successful) {
      Responder.success(res, affiliateDetails.result);
    } else {
      Responder.failed(res, affiliateDetails.errors);
    }
  }

  static async getAffiliates(req, res) {
    const getAffiliates = await GetAffiliatesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getAffiliates.successful) {
      Responder.success(res, getAffiliates.result);
    } else {
      Responder.failed(res, getAffiliates.errors);
    }
  }

  static async createAffiliate(req, res) {
    const createAffiliate = await CreateAffiliateService.execute(req.body);

    if (createAffiliate.successful) {
      Responder.success(res, createAffiliate.result);
    } else {
      Responder.failed(res, createAffiliate.errors);
    }
  }

  static async updateAffiliate(req, res) {
    const updateAffiliate = await UpdateAffiliateService.execute(req.body);

    if (updateAffiliate.successful) {
      Responder.success(res, updateAffiliate.result);
    } else {
      Responder.failed(res, updateAffiliate.errors);
    }
  }

  static async getTransactionAffiliate(req, res) {
    const getTransactionAffiliate =
      await GetTransactionAffiliateService.execute({
        ...req.body,
        ...req.query,
      });

    if (getTransactionAffiliate.successful) {
      Responder.success(res, getTransactionAffiliate.result);
    } else {
      Responder.failed(res, getTransactionAffiliate.errors);
    }
  }
}
