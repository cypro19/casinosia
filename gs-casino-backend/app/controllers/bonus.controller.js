import Responder from "../../server/expressResponder";
import {
  AvailBonusService,
  GetAllBonusService,
  GetBonusDetailService,
  GetUserBonusService,
  CancelBonusService,
  IssueFreeSpinBonusService,
  ActivateBonusService,
} from "../services/bonus";
import { userId } from "../utils/common";

export default class BonusController {
  static async getAllBonus(req, res) {
    const getAllBonus = await GetAllBonusService.execute({
      ...req.body,
      ...req.query,
    });

    if (getAllBonus.successful) {
      Responder.success(res, getAllBonus.result);
    } else {
      Responder.failed(res, getAllBonus.errors);
    }
  }

  static async getBonusDetail(req, res) {
    const getBonusDetail = await GetBonusDetailService.execute({
      ...req.body,
      ...req.query,
      userId: userId(req),
    });

    if (getBonusDetail.successful) {
      Responder.success(res, getBonusDetail.result);
    } else {
      Responder.failed(res, getBonusDetail.errors);
    }
  }

  static async availBonus(req, res) {
    const availBonus = await AvailBonusService.execute(req.body);

    if (availBonus.successful) {
      Responder.success(res, availBonus.result);
    } else {
      Responder.failed(res, availBonus.errors);
    }
  }

  static async activateBonus(req, res) {
    const activateBonus = await ActivateBonusService.execute(req.body);

    if (activateBonus.successful) {
      Responder.success(res, activateBonus.result);
    } else {
      Responder.failed(res, activateBonus.errors);
    }
  }

  static async getUserBonus(req, res) {
    const getUserBonus = await GetUserBonusService.execute({
      ...req.body,
      ...req.query,
    });

    if (getUserBonus.successful) {
      Responder.success(res, getUserBonus.result);
    } else {
      Responder.failed(res, getUserBonus.errors);
    }
  }

  static async cancelBonus(req, res) {
    const cancelBonus = await CancelBonusService.execute({
      ...req.body,
      ...req.query,
    });

    if (cancelBonus.successful) {
      Responder.success(res, cancelBonus.result);
    } else {
      Responder.failed(res, cancelBonus.errors);
    }
  }

  static async issueFreeSpins(req, res) {
    const issueFreeSpins = await IssueFreeSpinBonusService.execute(req.body);

    if (issueFreeSpins.successful) {
      Responder.success(res, issueFreeSpins.result);
    } else {
      Responder.failed(res, issueFreeSpins.errors);
    }
  }
}
