import Responder from "../../server/expressResponder";
import {
  CreateUserService,
  GetUserByIdService,
  GetUsersService,
  UpdateUserService,
  GetUserDocumentService,
  VerifyUserDocumentService,
  GetWithdrawRequestService,
  RequestDocumentService,
  CancelDocumentRequestService,
  AddTagsService,
  GetTagsService,
  SetDisableUntilService,
  SetDailyLimitService,
  SetLossLimitService,
  SetDepositLimitService,
  GetDuplicateUsersService,
  SetTimeLimitService,
  DeleteTagsService,
} from "../services/user";

export default class UserController {
  static async createUser(req, res) {
    const createUser = await CreateUserService.execute(req.body);

    if (createUser.successful) {
      Responder.success(res, createUser.result);
    } else {
      Responder.failed(res, createUser.errors);
    }
  }

  static async getUsers(req, res) {
    const getUsers = await GetUsersService.execute({
      ...req.body,
      ...req.query,
    });

    if (getUsers.successful) {
      Responder.success(res, getUsers.result);
    } else {
      Responder.failed(res, getUsers.errors);
    }
  }

  static async getUser(req, res) {
    const getUser = await GetUserByIdService.execute({
      ...req.body,
      ...req.query,
    });

    if (getUser.successful) {
      Responder.success(res, getUser.result);
    } else {
      Responder.failed(res, getUser.errors);
    }
  }

  static async getDuplicateUsers(req, res) {
    const duplicateUsers = await GetDuplicateUsersService.execute({
      ...req.body,
      ...req.query,
    });

    if (duplicateUsers.successful) {
      Responder.success(res, duplicateUsers.result);
    } else {
      Responder.failed(res, duplicateUsers.errors);
    }
  }

  static async updateUser(req, res) {
    const updateUser = await UpdateUserService.execute(req.body);

    if (updateUser.successful) {
      Responder.success(res, updateUser.result);
    } else {
      Responder.failed(res, updateUser.errors);
    }
  }

  static async getUserDocument(req, res) {
    const getUserDocument = await GetUserDocumentService.execute({
      ...req.body,
      ...req.query,
    });

    if (getUserDocument.successful) {
      Responder.success(res, getUserDocument.result);
    } else {
      Responder.failed(res, getUserDocument.errors);
    }
  }

  static async verifyUserDocument(req, res) {
    const verifyUserDocument = await VerifyUserDocumentService.execute(
      req.body
    );

    if (verifyUserDocument.successful) {
      Responder.success(res, verifyUserDocument.result);
    } else {
      Responder.failed(res, verifyUserDocument.errors);
    }
  }

  static async requestDocument(req, res) {
    const requestDocument = await RequestDocumentService.execute(req.body);

    if (requestDocument.successful) {
      Responder.success(res, requestDocument.result);
    } else {
      Responder.failed(res, requestDocument.errors);
    }
  }

  static async cancelDocumentRequest(req, res) {
    const cancelDocumentRequest = await CancelDocumentRequestService.execute(
      req.body
    );

    if (cancelDocumentRequest.successful) {
      Responder.success(res, cancelDocumentRequest.result);
    } else {
      Responder.failed(res, cancelDocumentRequest.errors);
    }
  }

  static async getAllWithdrawRequest(req, res) {
    const getAllWithdrawRequest = await GetWithdrawRequestService.execute({
      ...req.body,
      ...req.query,
    });

    if (getAllWithdrawRequest.successful) {
      Responder.success(res, getAllWithdrawRequest.result);
    } else {
      Responder.failed(res, getAllWithdrawRequest.errors);
    }
  }

  static async addTags(req, res) {
    const addTags = await AddTagsService.execute(req.body);

    if (addTags.successful) {
      Responder.success(res, addTags.result);
    } else {
      Responder.failed(res, addTags.errors);
    }
  }

  static async getTags(req, res) {
    const getAllTags = await GetTagsService.execute(req.body);

    if (getAllTags.successful) {
      Responder.success(res, getAllTags.result);
    } else {
      Responder.failed(res, getAllTags.errors);
    }
  }

  static async deleteTags(req, res) {
    const deleteTags = await DeleteTagsService.execute(req.body);

    if (deleteTags.successful) {
      Responder.success(res, deleteTags.result);
    } else {
      Responder.failed(res, deleteTags.errors);
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

  static async setTimeLimit(req, res) {
    const setTimeLimit = await SetTimeLimitService.execute(req.body);

    if (setTimeLimit.successful) {
      Responder.success(res, setTimeLimit.result);
    } else {
      Responder.failed(res, setTimeLimit.errors);
    }
  }
}
