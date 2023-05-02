import db from "../../db/models";
import { Op, Sequelize } from "sequelize";
import {
  AMOUNT_TYPE,
  TRANSACTION_STATUS,
  ACTION,
  TIME_PERIOD,
} from "../../utils/constant";

export const totalBets = async (fromDate, toDate, userId) => {
  const bets = await db.CasinoTransaction.sum("amount", {
    where: {
      userId,
      isSticky: false,
      actionType: ACTION.BET,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          ">=",
          new Date(fromDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          "<=",
          new Date(toDate)
        ),
      ],
    },
  });

  return bets;
};

export const totalWins = async (fromDate, toDate, userId) => {
  const wins = await db.CasinoTransaction.sum("amount", {
    where: {
      userId,
      actionType: ACTION.WIN,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          ">=",
          new Date(fromDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("created_at")),
          "<=",
          new Date(toDate)
        ),
      ],
    },
  });

  return wins;
};

export const getTimePeriod = async (bonusDetail) => {
  const period = bonusDetail.timePeriod;
  if (!period) return null;

  let fromDate, toDate;

  const from = new Date(Date.now());
  const to = new Date(Date.now());

  if (period === TIME_PERIOD.WEEKLY) {
    fromDate = new Date(from.setDate(from.getDate() - 7));
    toDate = new Date(to.setDate(to.getDate() - 1));
  } else if (period === TIME_PERIOD.MONTHLY) {
    fromDate = new Date(from.setDate(from.getDate() - 30));
    toDate = new Date(to.setDate(to.getDate() - 1));
  } else {
    fromDate = new Date(from.setDate(from.getDate() - 1));
    toDate = new Date(to.setDate(to.getDate() - 1));
  }

  return { fromDate, toDate };
};

export const getCashbackParameters = async (level, bonus) => {
  const data = bonus.other.loyaltyLevel.find(
    (object) => object.level === level
  );

  const bonusPercentage = data["bonusPercentage"];
  const wageringMultiplier = data["cashback_multiplier"];

  return { bonusPercentage, wageringMultiplier };
};
