import Responder from "../../server/expressResponder";
import {
  AddBalanceService,
  GetTransactionBankingDetail,
  GetTransactionUsersService,
  GetWalletService,
} from "../services/wallet";

export default class WalletController {
  static async getWallet(req, res) {
    const getWalletResult = await GetWalletService.execute(req.body);

    if (getWalletResult.successful) {
      Responder.success(res, getWalletResult.result);
    } else {
      Responder.failed(res, getWalletResult.errors);
    }
  }

  static async addBalance(req, res) {
    const addBalanceResult = await AddBalanceService.execute(req.body);

    if (addBalanceResult.successful) {
      Responder.success(res, addBalanceResult.result);
    } else {
      Responder.failed(res, addBalanceResult.errors);
    }
  }

  static async getTransactionDetails(req, res) {
    const transactionDetailsResult = await GetTransactionBankingDetail.execute({
      ...req.body,
      ...req.query,
    });

    if (transactionDetailsResult.successful) {
      if (transactionDetailsResult.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(transactionDetailsResult.result.fileName);
        return res.send(transactionDetailsResult.result.csvData);
      }
      Responder.success(res, transactionDetailsResult.result);
    } else {
      Responder.failed(res, transactionDetailsResult.errors);
    }
  }

  static async getTransactionUsers(req, res) {
    const getTransactionUsersResult = await GetTransactionUsersService.execute({
      ...req.body,
      ...req.query,
    });

    if (getTransactionUsersResult.successful) {
      Responder.success(res, getTransactionUsersResult.result);
    } else {
      Responder.failed(res, getTransactionUsersResult.errors);
    }
  }
}
