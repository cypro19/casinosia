import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { TRANSACTION_STATUS, AMOUNT_TYPE, ROLE } from "../../utils/constant";
import { getPrimaryCurrencyAmount } from "../../utils/common";

const constraints = {
  sourceUser: {
    presence: { allowEmpty: false },
  },
  targetUser: {
    presence: { allowEmpty: false },
  },
  addAmount: {
    presence: { allowEmpty: false },
  },
  transaction: {
    presence: { allowEmpty: false },
  },
  transactionType: {
    presence: { allowEmpty: false },
  },
  beforeBalance: {
    presence: false,
  },
  amountType: {
    presence: false,
  },
};

export class TransactionHandlerService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      sourceUser,
      targetUser,
      transaction,
      addAmount,
      beforeBalance,
      amountType,
      transactionType,
    } = this.filteredArgs;
    let balance = beforeBalance;
    let role, id;

    try {
      if (!targetUser.userWallet)
        return {
          err_type: ERRORS.BAD_DATA,
          err: "Wallet " + ERROR_MSG.NOT_EXISTS,
          success: false,
        };

      if (amountType && amountType === AMOUNT_TYPE.NON_CASH) {
        balance = Math.abs(targetUser.userWallet.nonCashAmount.toFixed(2));
      } else {
        if (!beforeBalance)
          balance = Math.abs(targetUser.userWallet.amount.toFixed(2));
      }

      const primaryCurrency = await getPrimaryCurrencyAmount({
        currencyCode: targetUser.userWallet.currencyCode,
        amount: addAmount,
      });

      let name = sourceUser.firstName;
      if (sourceUser.lastName) name = name + sourceUser.lastName;

      if (sourceUser?.superRoleId) {
        role = ROLE.SUPERADMIN;
        id = sourceUser.superAdminUserId;
      } else {
        role = ROLE.ADMIN;
        id = sourceUser.adminUserId;
      }

      const transactionDetails = {
        actioneeType: role,
        actioneeId: id,
        actioneeEmail: sourceUser.email,
        actioneeName: name,
        targetId: targetUser.userId,
        walletId: targetUser.userWallet.walletId,
        amount: addAmount,
        currencyCode: targetUser.userWallet.currencyCode,
        countryCode: targetUser.countryCode,
        beforeBalance: balance,
        primaryCurrencyAmount: primaryCurrency.amount,
        conversionRate: primaryCurrency.conversionRate,
        adminId: targetUser.parentId,
        amountType,
        transactionType,
        status: TRANSACTION_STATUS.SUCCESS,
        transactionDateTime: new Date().toISOString(),
        isSuccess: true,
      };

      const transactionBanking = await db.TransactionBanking.create(
        { ...transactionDetails },
        { transaction }
      );

      return { err: null, success: true, transactionBanking };
    } catch {
      return {
        err_type: ERRORS.INTERNAL,
        err: ERROR_MSG.SERVER_ERROR,
        success: false,
      };
    }
  }
}
