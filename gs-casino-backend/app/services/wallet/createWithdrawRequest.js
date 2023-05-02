import db from "../../db/models";
import { ROLE, TRANSACTION_STATUS } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";

const constraints = {
  withdrawAmount: {
    type: "number",
    format: (n, attributes, attributeName, options, constraints) => {
      if (Number(n) === n && n % 1 === 0) return null;
      if (Number(n) === n && n % 1 !== 0) return null;
      return false;
    },
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
  name: {
    presence: { allowEmpty: false },
  },
  transactionId: {
    presence: { allowEmpty: false },
  },
  transaction: {
    presence: { allowEmpty: false },
  },
  email: {
    presence: { allowEmpty: false },
  },
  paymentProvider: {
    presence: { allowEmpty: false },
  },
};

export class CreateWithdrawRequestService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      id,
      withdrawAmount,
      name,
      transactionId,
      transaction,
      email,
      paymentProvider,
    } = this.filteredArgs;
    withdrawAmount = Math.abs(withdrawAmount.toFixed(2));

    try {
      const userWallet = await getOne({
        model: db.Wallet,
        data: { ownerId: id, ownerType: ROLE.USER },
      });

      if (!userWallet) {
        return {
          err_type: ERRORS.BAD_DATA,
          err: "Wallet " + ERROR_MSG.NOT_EXISTS,
          success: false,
        };
      }

      let pendingWithdrawAmount = 0;
      pendingWithdrawAmount = await db.WithdrawRequest.sum("amount", {
        where: { userId: id, status: TRANSACTION_STATUS.PENDING },
      });

      if (userWallet.amount - userWallet.nonCashAmount < withdrawAmount) {
        return {
          err_type: ERRORS.BAD_DATA,
          err: ERROR_MSG.BALANCE_ERROR,
          success: false,
        };
      }

      if (
        pendingWithdrawAmount + withdrawAmount >
        userWallet.amount - userWallet.nonCashAmount
      ) {
        return {
          err_type: ERRORS.BAD_DATA,
          err: ERROR_MSG.WITHDRAW_ERR,
          success: false,
        };
      }

      const withdrawRequest = await db.WithdrawRequest.create(
        {
          userId: id,
          name,
          email,
          amount: withdrawAmount,
          paymentProvider,
          transactionId,
        },
        { transaction }
      );

      return { err: null, success: true, withdrawRequest };
    } catch {
      return {
        err_type: ERRORS.INTERNAL,
        err: ERROR_MSG.SERVER_ERROR,
        success: false,
      };
    }
  }
}
