import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { AMOUNT_TYPE, ROLE } from "../../utils/constant";
import { getPrimaryCurrencyAmount } from "../../utils/common";

const constraints = {
  adminDetails: {
    presence: false,
  },
  sourceUser: {
    presence: { allowEmpty: false },
  },
  amountType: {
    presence: false,
  },
  addAmount: {
    presence: { allowEmpty: false },
  },
  status: {
    presence: false,
  },
  conversionRate: {
    presence: false,
  },
  transactionType: {
    presence: { allowEmpty: false },
  },
  paymentTransactionId: {
    presence: false,
  },
  paymentTransactionName: {
    presence: false,
  },
  paymentProvider: {
    presence: false,
  },
  moreDetails: {
    presence: false,
  },
  isSuccess: {
    presence: false,
  },
  beforeBalance: {
    presence: false,
  },
  transaction: {
    presence: false,
  },
  options: {
    presence: { allowEmpty: false },
  },
};

export class TransactionHandlerService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      adminDetails,
      sourceUser,
      transaction,
      amountType,
      addAmount,
      conversionRate,
      status,
      transactionType,
      paymentTransactionId,
      paymentTransactionName,
      paymentProvider,
      moreDetails,
      options,
      isSuccess,
      beforeBalance,
    } = this.filteredArgs;

    try {
      if (!sourceUser.wallet)
        return {
          err_type: ERRORS.BAD_DATA,
          err: "Wallet " + ERROR_MSG.NOT_EXISTS,
          success: false,
        };

      let balance = beforeBalance;
      let rate = conversionRate;
      let actioneeData;

      if (adminDetails) {
        actioneeData = {
          actioneeType: adminDetails.role,
          actioneeId: adminDetails.id,
          actioneeEmail: adminDetails.email,
          actioneeName: adminDetails.name,
        };
      } else {
        actioneeData = {
          actioneeType: ROLE.USER,
          actioneeId: sourceUser.userId,
          actioneeEmail: sourceUser.email,
          actioneeName: sourceUser.firstName + " " + sourceUser.lastName,
        };
      }

      if (amountType && amountType === AMOUNT_TYPE.NON_CASH) {
        balance = Math.abs(sourceUser.wallet.nonCashAmount.toFixed(2));
      } else {
        if (!beforeBalance)
          balance = Math.abs(sourceUser.wallet.amount.toFixed(2));
      }

      const primaryCurrency = await getPrimaryCurrencyAmount({
        currencyCode: sourceUser.wallet.currencyCode,
        amount: addAmount,
      });
      if (!conversionRate) rate = primaryCurrency.conversionRate;

      const transactionDetails = {
        ...actioneeData,
        targetId: sourceUser.userId,
        walletId: sourceUser.wallet.walletId,
        amount: addAmount,
        currencyCode: sourceUser.wallet.currencyCode,
        beforeBalance: balance,
        primaryCurrencyAmount: primaryCurrency.amount,
        adminId: sourceUser.parentId,
        countryCode: sourceUser.countryCode,
        transactionType,
        transactionDateTime: new Date().toISOString(),
        conversionRate: rate,
        isSuccess,
        paymentTransactionId,
        isFirstDeposit: options.isFirstDeposit,
        paymentTransactionName,
        paymentProvider,
        amountType,
        status,
        moreDetails,
      };

      const transactionBanking = await db.TransactionBanking.create(
        { ...transactionDetails },
        { transaction, options }
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
