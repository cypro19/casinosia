import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { LiveUpdateWalletService } from "../microservice";
import { ROLE, TRANSACTION_STATUS } from "../../utils/constant";

const constraints = {
  withdrawRequestId: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  origin: {
    presence: { allowEmpty: false },
  },
};

export class CancelWithdrawRequestService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { withdrawRequestId, id, user, origin } = this.filteredArgs;

    try {
      const withdrawRequest = await getOne({
        model: db.WithdrawRequest,
        data: { withdrawRequestId },
        attributes: ["withdrawRequestId", "status", "transactionId", "amount"],
      });

      if (!withdrawRequest)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (withdrawRequest.status !== TRANSACTION_STATUS.PENDING)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_ALLOWED);

      const transactionsDetails = await getOne({
        model: db.TransactionBanking,
        data: {
          actioneeId: id,
          actioneeType: ROLE.USER,
          paymentTransactionId: withdrawRequest.transactionId,
        },
      });

      if (
        !transactionsDetails &&
        transactionsDetails.status !== TRANSACTION_STATUS.PENDING
      ) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_ALLOWED);
      }

      await transactionsDetails
        .set({ status: TRANSACTION_STATUS.CANCELLED })
        .save();

      const cancelWithdrawRequest = await updateEntity({
        model: db.WithdrawRequest,
        values: { withdrawRequestId },
        data: {
          status: TRANSACTION_STATUS.CANCELLED,
          actionableId: id,
          actionableType: ROLE.USER,
          actionedAt: new Date(),
        },
      });

      await user.userWallet
        .set({ amount: user.userWallet.amount + withdrawRequest.amount })
        .save();

      transactionsDetails.domainName = origin;

      user.domainName = origin;

      await LiveUpdateWalletService.execute({
        userUuid: origin,
        cash: user.userWallet.amount,
        nonCash: user.userWallet.nonCashAmount,
        userId: id,
        origin: "user-end",
      });
      return { cancelWithdrawRequest, message: SUCCESS_MSG.STATUS_UPDATED };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
