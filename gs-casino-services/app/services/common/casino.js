import CryptoJS from "crypto-js";
import encode from "crypto-js/enc-hex";
import { Sequelize } from "sequelize";

import { getOne } from "./crud";
import db from "../../db/models";
import { filterByDateCreatedAt } from "../../utils/common";
import {
  ACTION,
  AMOUNT_TYPE,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../utils/constant";

export const hashGenerator = ({ data, key }) => {
  return CryptoJS.HmacSHA256(JSON.stringify(data), key).toString(encode);
};

export const secureData = ({ data, key }) => {
  return CryptoJS.HmacMD5(data, key).toString(encode);
};

export const getLimitDates = () => {
  const today = new Date();

  let date = new Date();
  const offset = date.getTimezoneOffset();

  let monthStartDate = new Date(
    new Date(date.getFullYear(), date.getMonth(), 1).getTime() -
      offset * 60 * 1000
  );
  monthStartDate = monthStartDate.toISOString().split("T")[0];

  date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  const weekStartDate = new Date(date.setDate(diff));

  return {
    today: today.toISOString().substring(0, 10),
    monthStartDate,
    weekStartDate: weekStartDate.toISOString().substring(0, 10),
  };
};

export const getDepositLimitAmounts = async ({ userId, transaction }) => {
  const defaultQuery = {
    actioneeType: ROLE.USER,
    actioneeId: userId,
    transactionType: TRANSACTION_TYPE.DEPOSIT,
    status: TRANSACTION_STATUS.SUCCESS,
    amountType: AMOUNT_TYPE.CASH,
  };

  const { today, monthStartDate, weekStartDate } = getLimitDates();
  const todayQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    today,
    today,
    "TransactionBanking"
  );
  const monthQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    monthStartDate,
    today,
    "TransactionBanking"
  );
  const weekQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    weekStartDate,
    today,
    "TransactionBanking"
  );

  return {
    totalDepositAmountToday: await db.TransactionBanking.sum("amount", {
      where: todayQuery,
      transaction,
    }),
    totalDepositAmountWeekly: await db.TransactionBanking.sum("amount", {
      where: weekQuery,
      transaction,
    }),
    totalDepositAmountMonthly: await db.TransactionBanking.sum("amount", {
      where: monthQuery,
      transaction,
    }),
  };
};

export const getWagerLimitAmounts = async ({ walletId, transaction }) => {
  const defaultQuery = {
    walletId,
    status: TRANSACTION_STATUS.COMPLETED,
    actionType: ACTION.BET,
  };

  const { today, monthStartDate, weekStartDate } = getLimitDates();
  const todayQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    today,
    today,
    "CasinoTransaction"
  );
  const monthQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    monthStartDate,
    today,
    "CasinoTransaction"
  );
  const weekQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    weekStartDate,
    today,
    "CasinoTransaction"
  );

  return {
    totalBetAmountToday:
      (await db.CasinoTransaction.sum("amount", {
        where: todayQuery,
        transaction,
      })) +
      (await db.CasinoTransaction.sum("nonCashAmount", {
        where: todayQuery,
        transaction,
      })),
    totalBetAmountWeekly:
      (await db.CasinoTransaction.sum("amount", {
        where: weekQuery,
        transaction,
      })) +
      (await db.CasinoTransaction.sum("nonCashAmount", {
        where: weekQuery,
        transaction,
      })),
    totalBetAmountMonthly:
      (await db.CasinoTransaction.sum("amount", {
        where: monthQuery,
        transaction,
      })) +
      (await db.CasinoTransaction.sum("nonCashAmount", {
        where: monthQuery,
        transaction,
      })),
  };
};

export const getLossLimitAmounts = async ({ userId, transaction }) => {
  const defaultQuery = {
    status: TRANSACTION_STATUS.COMPLETED,
  };

  const { today, monthStartDate, weekStartDate } = getLimitDates();
  const todayQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    today,
    today,
    "CasinoTransaction"
  );
  const monthQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    monthStartDate,
    today,
    "CasinoTransaction"
  );
  const weekQuery = filterByDateCreatedAt(
    JSON.parse(JSON.stringify(defaultQuery)),
    weekStartDate,
    today,
    "CasinoTransaction"
  );

  const totalLossAmountToday = await db.CasinoTransaction.findOne({
    where: { ...todayQuery, userId },
    attributes: [
      [
        Sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then amount else 0 end) -
      sum(case when action_type = 'win' then amount else 0 end)as numeric),2) `),
        "amount",
      ],
      [
        Sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then non_cash_amount else 0 end) -
      sum(case when action_type = 'win' then non_cash_amount else 0 end)as numeric),2) `),
        "nonCashAmount",
      ],
    ],
    raw: true,
    transaction,
  });

  const totalLossAmountWeekly = await db.CasinoTransaction.findOne({
    where: { ...weekQuery, userId },
    attributes: [
      [
        Sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then amount else 0 end) -
      sum(case when action_type = 'win' then amount else 0 end)as numeric),2) `),
        "amount",
      ],
      [
        Sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then non_cash_amount else 0 end) -
      sum(case when action_type = 'win' then non_cash_amount else 0 end)as numeric),2) `),
        "nonCashAmount",
      ],
    ],
    raw: true,
    transaction,
  });

  const totalLossAmountMonthly = await db.CasinoTransaction.findOne({
    where: { ...monthQuery, userId },
    attributes: [
      [
        Sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then amount else 0 end) -
      sum(case when action_type = 'win' then amount else 0 end)as numeric),2) `),
        "amount",
      ],
      [
        Sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then non_cash_amount else 0 end) -
      sum(case when action_type = 'win' then non_cash_amount else 0 end)as numeric),2) `),
        "nonCashAmount",
      ],
    ],
    raw: true,
    transaction,
  });

  if (totalLossAmountToday === null) {
    totalLossAmountToday.amount = 0;
    totalLossAmountToday.nonCashAmount = 0;
  }
  if (totalLossAmountWeekly === null) {
    totalLossAmountWeekly.amount = 0;
    totalLossAmountWeekly.nonCashAmount = 0;
  }
  if (totalLossAmountMonthly === null) {
    totalLossAmountMonthly.amount = 0;
    totalLossAmountMonthly.nonCashAmount = 0;
  }

  return {
    totalLossAmountToday: parseFloat(
      totalLossAmountToday.amount + totalLossAmountToday.nonCashAmount
    ),
    totalLossAmountWeekly: parseFloat(
      totalLossAmountWeekly.amount + totalLossAmountWeekly.nonCashAmount
    ),
    totalLossAmountMonthly: parseFloat(
      totalLossAmountMonthly.amount + totalLossAmountMonthly.nonCashAmount
    ),
  };
};

export const checkDepositLimit = async ({
  userId,
  userLimits,
  transaction,
  TransactionBanking,
}) => {
  const {
    totalDepositAmountToday,
    totalDepositAmountWeekly,
    totalDepositAmountMonthly,
  } = await getDepositLimitAmounts({ userId, transaction, TransactionBanking });

  const limitTable = {};

  limitTable.dailyDepositLimit = {
    currentLimit: userLimits.dailyDepositLimit || "Not Set",
    usedLimit: parseFloat(totalDepositAmountToday?.toFixed(2)),
    updatedAt: userLimits.dailyDepositUpdatedAt,
    expiry: userLimits.dailyDepositExpiry,
  };
  limitTable.weeklyDepositLimit = {
    currentLimit: userLimits.weeklyDepositLimit || "Not Set",
    usedLimit: parseFloat(totalDepositAmountWeekly?.toFixed(2)),
    updatedAt: userLimits.weeklyDepositUpdatedAt,
    expiry: userLimits.weeklyDepositExpiry,
  };
  limitTable.monthlyDepositLimit = {
    currentLimit: userLimits.monthlyDepositLimit || "Not Set",
    usedLimit: parseFloat(totalDepositAmountMonthly?.toFixed(2)),
    updatedAt: userLimits.monthlyDepositUpdatedAt,
    expiry: userLimits.monthlyDepositExpiry,
  };

  return limitTable;
};

export const checkLimits = async ({
  userExist,
  walletId,
  betAmount,
  transaction,
}) => {
  const userLimits = await getOne({
    model: db.Limit,
    data: { userId: userExist.userId },
    raw: true,
    transaction,
  });

  if (!userLimits) return { limitReached: false, limitTable: {} };

  const { totalBetAmountToday, totalBetAmountWeekly, totalBetAmountMonthly } =
    await getWagerLimitAmounts({ walletId, transaction });
  const {
    totalLossAmountToday,
    totalLossAmountWeekly,
    totalLossAmountMonthly,
  } = await getLossLimitAmounts({ userId: userExist.userId, transaction });

  let limitTable = {};

  limitTable.dailyBetLimit = {
    currentLimit: userLimits.dailyBetLimit || "Not Set",
    usedLimit: parseFloat(totalBetAmountToday?.toFixed(2)),
    updatedAt: userLimits.dailyBetUpdatedAt,
    expiry: userLimits.dailyBetExpiry,
  };
  limitTable.weeklyBetLimit = {
    currentLimit: userLimits.weeklyBetLimit || "Not Set",
    usedLimit: parseFloat(totalBetAmountWeekly?.toFixed(2)),
    updatedAt: userLimits.weeklyBetUpdatedAt,
    expiry: userLimits.weeklyBetExpiry,
  };
  limitTable.monthlyBetLimit = {
    currentLimit: userLimits.monthlyBetLimit || "Not Set",
    usedLimit: parseFloat(totalBetAmountMonthly?.toFixed(2)),
    updatedAt: userLimits.monthlyBetUpdatedAt,
    expiry: userLimits.monthlyBetExpiry,
  };

  limitTable.dailyLossLimit = {
    currentLimit: userLimits.dailyLossLimit || "Not Set",
    usedLimit: parseFloat((totalLossAmountToday || 0).toFixed(2)),
    updatedAt: userLimits.dailyLossUpdatedAt,
    expiry: userLimits.dailyLossExpiry,
  };
  limitTable.weeklyLossLimit = {
    currentLimit: userLimits.weeklyLossLimit || "Not Set",
    usedLimit: parseFloat((totalLossAmountWeekly || 0).toFixed(2)),
    updatedAt: userLimits.weeklyLossUpdatedAt,
    expiry: userLimits.weeklyLossExpiry,
  };
  limitTable.monthlyLossLimit = {
    currentLimit: userLimits.monthlyLossLimit || "Not Set",
    usedLimit: parseFloat((totalLossAmountMonthly || 0).toFixed(2)),
    updatedAt: userLimits.monthlyLossUpdatedAt,
    expiry: userLimits.monthlyLossExpiry,
  };

  limitTable = {
    ...limitTable,
    ...(await checkDepositLimit({
      userId: userExist.userId,
      userLimits,
      transaction,
    })),
  };

  if (
    userLimits.dailyBetLimit &&
    totalBetAmountToday + betAmount > userLimits.dailyBetLimit
  ) {
    return {
      limitReached: true,
      message: "Daily Wager limit reached",
      limitTable,
    };
  }
  if (
    userLimits.weeklyBetLimit &&
    totalBetAmountWeekly + betAmount > userLimits.weeklyBetLimit
  ) {
    return {
      limitReached: true,
      message: "Weekly Wager limit reached",
      limitTable,
    };
  }
  if (
    userLimits.monthlyBetLimit &&
    totalBetAmountMonthly + betAmount > userLimits.monthlyBetLimit
  ) {
    return {
      limitReached: true,
      message: "Monthly Wager limit reached",
      limitTable,
    };
  }

  if (
    userLimits.dailyLossLimit &&
    totalLossAmountToday + betAmount > userLimits.dailyLossLimit
  ) {
    return {
      limitReached: true,
      message: "Daily Loss limit reached",
      limitTable,
    };
  }
  if (
    userLimits.weeklyLossLimit &&
    totalLossAmountWeekly + betAmount > userLimits.weeklyLossLimit
  ) {
    return {
      limitReached: true,
      message: "Weekly Loss limit reached",
      limitTable,
    };
  }
  if (
    userLimits.monthlyLossLimit &&
    totalLossAmountMonthly + betAmount > userLimits.monthlyLossLimit
  ) {
    return {
      limitReached: true,
      message: "Monthly Loss limit reached",
      limitTable,
    };
  }

  return { limitReached: false, limitTable };
};
