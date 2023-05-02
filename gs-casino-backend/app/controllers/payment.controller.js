import Responder from "../../server/expressResponder";
import {
  AuthorizeService,
  CancelService,
  InitPayService,
  TransferService,
  VerifyUserService,
} from "../services/payment";

export default class PaymentController {
  static async initPay(req, res) {
    const initPay = await InitPayService.execute({ ...req.body, ...req.query });

    if (initPay.successful) {
      Responder.success(res, initPay.result);
    } else {
      Responder.failed(res, initPay.errors);
    }
  }

  static async verifyUser(req, res) {
    const verifyUser = await VerifyUserService.execute(req.body);

    if (verifyUser.successful) {
      Responder.success(res, verifyUser.result);
    } else {
      Responder.failed(res, verifyUser.errors);
    }
  }

  static async authorize(req, res) {
    const authorize = await AuthorizeService.execute(req.body);

    if (authorize.successful) {
      Responder.success(res, authorize.result);
    } else {
      Responder.failed(res, authorize.errors);
    }
  }

  static async transfer(req, res) {
    const transfer = await TransferService.execute(req.body);

    if (transfer.successful) {
      Responder.success(res, transfer.result);
    } else {
      Responder.failed(res, transfer.errors);
    }
  }

  static async cancel(req, res) {
    const cancel = await CancelService.execute(req.body);

    if (cancel.successful) {
      Responder.success(res, cancel.result);
    } else {
      Responder.failed(res, cancel.errors);
    }
  }
}
