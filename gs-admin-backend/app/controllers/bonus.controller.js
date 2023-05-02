import Responder from "../../server/expressResponder";
import {
  CreateWageringTemplateService,
  GetWageringTemplateDetails,
  GetAllWageringTemplatesService,
  UpdateWageringTemplateService,
  GetWageringTemplatesService,
  CreateBonusService,
  UpdateBonusService,
  GetBonusService,
  GetBonusDetailService,
  GetPaymentMethodsService,
  ConvertAmountService,
  GetBalanceBonusesService,
  DeleteBonusService,
  IssueBonusService,
  GetUserBonusService,
  CancelBonusService,
} from "../services/bonus";
import { validateFile } from "../utils/common";
import { OK } from "../utils/constant";
import { ERRORS } from "../utils/errors";

export default class BonusController {
  static async createBonus(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const createBonus = await CreateBonusService.execute({
      ...req.body,
      bonusImage: req.file,
    });

    if (createBonus.successful) {
      Responder.success(res, createBonus.result);
    } else {
      Responder.failed(res, createBonus.errors);
    }
  }

  static async updateBonus(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const updateBonus = await UpdateBonusService.execute({
      ...req.body,
      bonusImage: req.file,
    });

    if (updateBonus.successful) {
      Responder.success(res, updateBonus.result);
    } else {
      Responder.failed(res, updateBonus.errors);
    }
  }

  static async issueBonus(req, res) {
    const issueBonus = await IssueBonusService.execute(req.body);

    if (issueBonus.successful) {
      Responder.success(res, issueBonus.result);
    } else {
      Responder.failed(res, issueBonus.errors);
    }
  }

  static async cancelBonus(req, res) {
    const cancelBonus = await CancelBonusService.execute(req.body);

    if (cancelBonus.successful) {
      Responder.success(res, cancelBonus.result);
    } else {
      Responder.failed(res, cancelBonus.errors);
    }
  }

  static async getUserBonus(req, res) {
    const getUserBonus = await GetUserBonusService.execute(req.query);

    if (getUserBonus.successful) {
      Responder.success(res, getUserBonus.result);
    } else {
      Responder.failed(res, getUserBonus.errors);
    }
  }

  static async getAllBonus(req, res) {
    const getBonusResult = await GetBonusService.execute({
      ...req.body,
      ...req.query,
    });

    if (getBonusResult.successful) {
      Responder.success(res, getBonusResult.result);
    } else {
      Responder.failed(res, getBonusResult.errors);
    }
  }

  static async getBonusDetail(req, res) {
    const getBonusDetailResult = await GetBonusDetailService.execute({
      ...req.body,
      ...req.query,
    });

    if (getBonusDetailResult.successful) {
      Responder.success(res, getBonusDetailResult.result);
    } else {
      Responder.failed(res, getBonusDetailResult.errors);
    }
  }

  static async getBalanceBonus(req, res) {
    const getBonusResult = await GetBalanceBonusesService.execute(req.query);

    if (getBonusResult.successful) {
      Responder.success(res, getBonusResult.result);
    } else {
      Responder.failed(res, getBonusResult.errors);
    }
  }

  static async deleteBonus(req, res) {
    const deleteBonus = await DeleteBonusService.execute(req.body);

    if (deleteBonus.successful) {
      Responder.success(res, deleteBonus.result);
    } else {
      Responder.failed(res, deleteBonus.errors);
    }
  }

  static async convertAmount(req, res) {
    const convertAmount = await ConvertAmountService.execute(req.query);

    if (convertAmount.successful) {
      Responder.success(res, convertAmount.result);
    } else {
      Responder.failed(res, convertAmount.errors);
    }
  }

  static async getPaymentMethods(req, res) {
    const getPaymentMethods = await GetPaymentMethodsService.execute(req.body);

    if (getPaymentMethods.successful) {
      Responder.success(res, getPaymentMethods.result);
    } else {
      Responder.failed(res, getPaymentMethods.errors);
    }
  }

  static async createWageringTemplate(req, res) {
    const createWageringTemplate = await CreateWageringTemplateService.execute(
      req.body
    );

    if (createWageringTemplate.successful) {
      Responder.success(res, createWageringTemplate.result);
    } else {
      Responder.failed(res, createWageringTemplate.errors);
    }
  }

  static async updateWageringTemplate(req, res) {
    const updateWageringTemplate = await UpdateWageringTemplateService.execute(
      req.body
    );

    if (updateWageringTemplate.successful) {
      Responder.success(res, updateWageringTemplate.result);
    } else {
      Responder.failed(res, updateWageringTemplate.errors);
    }
  }

  static async getAllWageringTemplates(req, res) {
    const getWageringTemplates = await GetAllWageringTemplatesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getWageringTemplates.successful) {
      Responder.success(res, getWageringTemplates.result);
    } else {
      Responder.failed(res, getWageringTemplates.errors);
    }
  }

  static async getWageringTemplates(req, res) {
    const getWageringTemplates = await GetWageringTemplatesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getWageringTemplates.successful) {
      Responder.success(res, getWageringTemplates.result);
    } else {
      Responder.failed(res, getWageringTemplates.errors);
    }
  }

  static async getWageringTemplateDetails(req, res) {
    const getTemplateDetails = await GetWageringTemplateDetails.execute({
      ...req.body,
      ...req.query,
    });

    if (getTemplateDetails.successful) {
      Responder.success(res, getTemplateDetails.result);
    } else {
      Responder.failed(res, getTemplateDetails.errors);
    }
  }
}
