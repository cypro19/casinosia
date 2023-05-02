import db from "../db/models";
import { Op } from "sequelize";
import { AMOUNT_TYPE, ROLE } from "../libs/constants";

const getPrimaryCurrencyAmount = async ({ currencyCode, amount }) => {
  let primaryCurrencyRate, secondaryCurrencyRate;

  const currencyDetail = await db.Currency.findAll({
    where: { [Op.or]: { code: currencyCode, isPrimary: true } },
    attributes: ["exchangeRate", "code"],
  });

  if (currencyDetail.length === 1) {
    primaryCurrencyRate = currencyDetail[0].exchangeRate;
    secondaryCurrencyRate = currencyDetail[0].exchangeRate;
  } else {
    if (currencyDetail[0].code === currencyCode) {
      primaryCurrencyRate = currencyDetail[1].exchangeRate;
      secondaryCurrencyRate = currencyDetail[0].exchangeRate;
    } else {
      primaryCurrencyRate = currencyDetail[0].exchangeRate;
      secondaryCurrencyRate = currencyDetail[1].exchangeRate;
    }
  }

  const conversionRate =
    parseFloat(secondaryCurrencyRate) / primaryCurrencyRate;
  amount = Math.abs((amount * conversionRate).toFixed(2));
  return { amount, conversionRate };
};

export const TransactionHandler = async (data) => {
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
  } = data;

  try {
    if (!sourceUser.userWallet)
      return { err_type: "Bad Data", err: "Wallet bot exist", success: false };

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
      balance = Math.abs(sourceUser.userWallet.nonCashAmount.toFixed(2));
    } else {
      if (!beforeBalance)
        balance = Math.abs(sourceUser.userWallet.amount.toFixed(2));
    }

    const primaryCurrency = await getPrimaryCurrencyAmount({
      currencyCode: sourceUser.userWallet.currencyCode,
      amount: addAmount,
    });

    if (!conversionRate) rate = primaryCurrency.conversionRate;

    const transactionDetails = {
      ...actioneeData,
      targetId: sourceUser.userId,
      walletId: sourceUser.userWallet.walletId,
      amount: addAmount,
      currencyCode: sourceUser.userWallet.currencyCode,
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
      err_type: "internal",
      err: "Error in Transaction Handler",
      success: false,
    };
  }
};
