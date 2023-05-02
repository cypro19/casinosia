import { OK } from "../utils/constant";

import { ERRORS } from "../utils/errors";
import Responder from "../../server/expressResponder";
import { CancelFreeSpinService } from "../services/casino";
import { validateFile } from "../utils/common";
import { LiveUpdateWalletService } from "../services/microservice";
import {
  GetCurrentWinnerService,
  GetGameReportService,
  GetTopWinnersService,
} from "../services/reports";
import {
  SetDisableUntilService,
  SetDailyLimitService,
  SetLossLimitService,
  SetDepositLimitService,
  SetTimeLimitService,
  GetLimitTableService,
} from "../services/settings";
import {
  GetUserDetailsService,
  UpdateUserService,
  GetWithdrawRequestsService,
  UserSignUpService,
  CancelWithdrawRequestService,
  GetUserTransactionsService,
  GetAccountDetailService,
  UploadProfileImageService,
  RemoveProfileImageService,
  InsertUniqueUserKeyService,
  GetLoyaltyDetailsService,
  CheckUniqueEmailUsername,
} from "../services/user";

export default class UserController {
  static async checkEmailUsername(req, res) {
    const checkEmailUsername = await CheckUniqueEmailUsername.execute({
      ...req.query,
      ...req.body,
    });

    if (checkEmailUsername.successful) {
      Responder.success(res, checkEmailUsername.result);
    } else {
      Responder.failed(res, checkEmailUsername.errors);
    }
  }

  static async userSignUp(req, res) {
    const createUser = await UserSignUpService.execute(req.body);

    if (createUser.successful) {
      Responder.success(res, createUser.result);
    } else {
      Responder.failed(res, createUser.errors);
    }
  }

  static async getUserDetails(req, res) {
    const getUserDetails = await GetUserDetailsService.execute(req.body);

    if (getUserDetails.successful) {
      Responder.success(res, getUserDetails.result);
    } else {
      Responder.failed(res, getUserDetails.errors);
    }
  }

  static async updateUserDetails(req, res) {
    const updateUserDetails = await UpdateUserService.execute(req.body);

    if (updateUserDetails.successful) {
      Responder.success(res, updateUserDetails.result);
    } else {
      Responder.failed(res, updateUserDetails.errors);
    }
  }

  static async uploadProfileImage(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const uploadProfileImage = await UploadProfileImageService.execute({
      ...req.body,
      profileImage: req.file,
    });

    if (uploadProfileImage.successful) {
      Responder.success(res, uploadProfileImage.result);
    } else {
      Responder.failed(res, uploadProfileImage.errors);
    }
  }

  static async removeProfileImage(req, res) {
    const removeProfileImage = await RemoveProfileImageService.execute(
      req.body
    );

    if (removeProfileImage.successful) {
      Responder.success(res, removeProfileImage.result);
    } else {
      Responder.failed(res, removeProfileImage.errors);
    }
  }

  static async getWithdrawRequests(req, res) {
    const getWithdrawRequests = await GetWithdrawRequestsService.execute({
      ...req.body,
      ...req.query,
    });

    if (getWithdrawRequests.successful) {
      Responder.success(res, getWithdrawRequests.result);
    } else {
      Responder.failed(res, getWithdrawRequests.errors);
    }
  }

  static async cancelWithdrawRequest(req, res) {
    const cancelWithdrawRequest = await CancelWithdrawRequestService.execute(
      req.body
    );

    if (cancelWithdrawRequest.successful) {
      Responder.success(res, cancelWithdrawRequest.result);
    } else {
      Responder.failed(res, cancelWithdrawRequest.errors);
    }
  }

  static async getUserTransactions(req, res) {
    const getUserTransactions = await GetUserTransactionsService.execute({
      ...req.body,
      ...req.query,
    });

    if (getUserTransactions.successful) {
      Responder.success(res, getUserTransactions.result);
    } else {
      Responder.failed(res, getUserTransactions.errors);
    }
  }

  static async getAccountDetail(req, res) {
    const getAccountDetail = await GetAccountDetailService.execute(req.body);

    if (getAccountDetail.successful) {
      Responder.success(res, getAccountDetail.result);
    } else {
      Responder.failed(res, getAccountDetail.errors);
    }
  }

  static async setDisableUntil(req, res) {
    const setDisableUntil = await SetDisableUntilService.execute(req.body);

    if (setDisableUntil.successful) {
      Responder.success(res, setDisableUntil.result);
    } else {
      Responder.failed(res, setDisableUntil.errors);
    }
  }

  static async setDailyLimit(req, res) {
    const setDailyLimit = await SetDailyLimitService.execute(req.body);

    if (setDailyLimit.successful) {
      Responder.success(res, setDailyLimit.result);
    } else {
      Responder.failed(res, setDailyLimit.errors);
    }
  }

  static async setLossLimit(req, res) {
    const setLossLimit = await SetLossLimitService.execute(req.body);

    if (setLossLimit.successful) {
      Responder.success(res, setLossLimit.result);
    } else {
      Responder.failed(res, setLossLimit.errors);
    }
  }

  static async setDepositLimit(req, res) {
    const setDepositLimit = await SetDepositLimitService.execute(req.body);

    if (setDepositLimit.successful) {
      Responder.success(res, setDepositLimit.result);
    } else {
      Responder.failed(res, setDepositLimit.errors);
    }
  }

  static async getLimitTable(req, res) {
    const getLimitTable = await GetLimitTableService.execute(req.body);

    if (getLimitTable.successful) {
      Responder.success(res, getLimitTable.result);
    } else {
      Responder.failed(res, getLimitTable.errors);
    }
  }

  static async setTimeLimit(req, res) {
    const setTimeLimit = await SetTimeLimitService.execute(req.body);

    if (setTimeLimit.successful) {
      Responder.success(res, setTimeLimit.result);
    } else {
      Responder.failed(res, setTimeLimit.errors);
    }
  }

  static async liveUpdateWallet(req, res) {
    const liveUpdateWallet = await LiveUpdateWalletService.execute(req.body);

    if (liveUpdateWallet.successful) {
      Responder.success(res, liveUpdateWallet.result);
    } else {
      Responder.failed(res, liveUpdateWallet.errors);
    }
  }

  static async insertUniqueUserIdentification(req, res) {
    const insertKey = await InsertUniqueUserKeyService.execute(req.body);

    if (insertKey.successful) {
      Responder.success(res, insertKey.result);
    } else {
      Responder.failed(res, insertKey.errors);
    }
  }

  static async getLoyaltyDetails(req, res) {
    const getLoyaltyDetails = await GetLoyaltyDetailsService.execute(req.body);

    if (getLoyaltyDetails.successful) {
      Responder.success(res, getLoyaltyDetails.result);
    } else {
      Responder.failed(res, getLoyaltyDetails.errors);
    }
  }

  static async getTopGames(req, res) {
    const getTopGames = await GetGameReportService.execute({
      ...req.body,
      ...req.query,
    });

    if (getTopGames.successful) {
      Responder.success(res, getTopGames.result);
    } else {
      Responder.failed(res, getTopGames.errors);
    }
  }

  static async getTopWinners(req, res) {
    const getTopWinners = await GetTopWinnersService.execute({
      ...req.body,
      ...req.query,
    });

    if (getTopWinners.successful) {
      Responder.success(res, getTopWinners.result);
    } else {
      Responder.failed(res, getTopWinners.errors);
    }
  }

  static async getCurrentWinners(req, res) {
    const getCurrentWinners = await GetCurrentWinnerService.execute({
      ...req.body,
      ...req.query,
    });

    if (getCurrentWinners.successful) {
      Responder.success(res, getCurrentWinners.result);
    } else {
      Responder.failed(res, getCurrentWinners.errors);
    }
  }

  static async cancelFreespins(req, res) {
    const cancelFreespins = await CancelFreeSpinService.execute(req.body);

    if (cancelFreespins.successful) {
      Responder.success(res, cancelFreespins.result);
    } else {
      Responder.failed(res, cancelFreespins.errors);
    }
  }
}
