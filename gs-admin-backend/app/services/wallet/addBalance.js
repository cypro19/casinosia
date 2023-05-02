import db from "../../db/models";
import { insertUpdate } from "../helper/customerIo";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getUserDetails } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { TransactionHandlerService } from "./transactionHandler";
import { liveUpdateWallet } from "../helper/email";
import { AMOUNT_TYPE, TRANSACTION_TYPE } from "../../utils/constant";
import {
  createConnection,
  walletObject,
  customerObject,
} from "../helper/rabbitMq";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  addAmount: {
    type: "number",
    format: (n, attributes, attributeName, options, constraints) => {
      if (Number(n) === n && n % 1 === 0) return null;
      if (Number(n) === n && n % 1 !== 0) return null;
      return false;
    },
    presence: { allowEmpty: false },
  },
  walletType: {
    inclusion: {
      within: ["CASH", "NONCASH"],
      message: "can be 'CASH', 'NONCASH'",
    },
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class AddBalanceService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const transaction = await db.sequelize.transaction();

    let { userId, addAmount, user, walletType } = this.filteredArgs;

    try {
      const userDetails = await getUserDetails(userId);

      if (!userDetails || userDetails)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_EXISTS);

      addAmount = parseFloat(addAmount.toFixed(2));

      let amountType, transactionType;
      if (walletType === "CASH") {
        amountType = AMOUNT_TYPE.CASH;
      } else if (walletType === "NONCASH") {
        amountType = AMOUNT_TYPE.NON_CASH;
      }
      if (addAmount > 0) {
        transactionType = TRANSACTION_TYPE.ADD_BALANCE;
      } else {
        transactionType = TRANSACTION_TYPE.REMOVE_BALANCE;
        if (walletType === "CASH") {
          if (userDetails.userWallet.amount + addAmount < 0)
            return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.REMOVE_MONEY);
        } else if (walletType === "NONCASH") {
          if (userDetails.userWallet.nonCashAmount + addAmount < 0)
            return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.REMOVE_MONEY);
        }
      }

      const transactionHandler = await TransactionHandlerService.execute({
        sourceUser: user,
        targetUser: userDetails.dataValues,
        amountType,
        transactionType,
        transaction,
        addAmount,
      });

      if (!transactionHandler.result.success) {
        await transaction.rollback();
        return this.addError(
          transactionHandler.result.err_type,
          transactionHandler.result.err
        );
      }

      if (walletType === "CASH") {
        await userDetails.userWallet
          .set({
            amount:
              Math.round((userDetails.userWallet.amount + addAmount) * 100) /
              100,
          })
          .save({ transaction });
      } else if (walletType === "NONCASH") {
        await userDetails.userWallet
          .set({
            nonCashAmount:
              Math.round(
                (userDetails.userWallet.nonCashAmount + addAmount) * 100
              ) / 100,
          })
          .save({ transaction });
      }

      insertUpdate(userId, {
        account_balance: userDetails.userWallet.amount,
        bonus_account_balance: userDetails.userWallet.nonCashAmount,
      });
      transactionHandler.result.transactionBanking.domainName =
        userDetails?.domain;
      const details = await walletObject(
        transactionHandler.result.transactionBanking
      );
      await createConnection("PostWallets", details);

      userDetails.domainName = userDetails?.domain;
      const customerDetails = await customerObject(userDetails);
      await createConnection("PostCustomers", customerDetails);

      const targetOrigin = userDetails?.domain;

      await liveUpdateWallet({
        userId,
        targetOrigin,
        cash: Math.round(userDetails.userWallet.amount * 100) / 100,
        nonCash: userDetails.userWallet.nonCashAmount,
      });

      await transaction.commit();
      return { success: true, message: SUCCESS_MSG.DEPOSIT_SUCCESS };
    } catch (error) {
      await transaction.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
