import db from "../db/models";
import Logger from "../common/logger";
import { Op, Sequelize } from "sequelize";
import { BONUS_STATUS, BONUS_TYPE } from "./constant";
import { getAll, getOne } from "../services/common/crud";

export const getOtherCurrenciesAmount = async ({
  amount,
  primary,
  currencyCode,
  transaction,
}) => {
  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ["exchangeRate"],
    raw: true,
    transaction,
  });

  if (primary) {
    const primaryCurrency = await getOne({
      model: db.Currency,
      data: { isPrimary: true },
      raw: true,
      transaction,
    });
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) /
      primaryCurrency.exchangeRate;
    amount = Math.abs((amount * conversionRate).toFixed(2));
    return { amount, conversionRate };
  }

  const targetCurrencies = await getAll({
    model: db.Currency,
    raw: true,
    transaction,
  });
  const amountInOtherCurrencies = {};

  targetCurrencies.forEach((currency) => {
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) / currency.exchangeRate;
    amountInOtherCurrencies[currency.code] = Math.abs(
      (amount * conversionRate).toFixed(2)
    );
  });

  return amountInOtherCurrencies;
};

export const getGameAggregatorAndProvider = async ({ game, transaction }) => {
  const gameData = await db.MasterCasinoGame.findOne({
    where: { identifier: game },
    attributes: ["masterCasinoGameId", "name"],
    include: [
      {
        model: db.MasterCasinoProvider,
        attributes: ["name", "masterCasinoProviderId"],
        include: [
          {
            model: db.MasterGameAggregator,
            attributes: ["name"],
          },
        ],
      },
      {
        model: db.MasterGameSubCategory,
        attributes: ["name"],
      },
    ],
    raw: true,
    transaction,
  });

  return {
    masterCasinoGameId: gameData["masterCasinoGameId"],
    aggregator: gameData["MasterCasinoProvider.MasterGameAggregator.name"],
    provider: gameData["MasterCasinoProvider.name"],
    providerId: gameData["MasterCasinoProvider.masterCasinoProviderId"],
    gameCategory: gameData["MasterGameSubCategory".name],
    gameName: gameData["name"],
  };
};

export const checkActiveBonus = async ({
  userId,
  gameId,
  game,
  transaction,
}) => {
  let userBonus = await getOne({
    model: db.UserBonus,
    data: { userId, status: BONUS_STATUS.ACTIVE },
    include: { model: db.Bonus, as: "bonus" },
    transaction,
  });

  Logger.info("checking bonus");

  if (userBonus?.bonusType === BONUS_TYPE.FREESPINS) {
    if (userBonus.games[gameId]) {
      Logger.info("freeSpin bonus with non-freespin game", {
        message: game.masterCasinoGameId,
      });
      userBonus = false;
    }
  }

  return userBonus;
};

export const getPrimaryCurrencyAmount = async ({
  currencyCode,
  amount,
  transaction,
}) => {
  const primaryCurrency = await getOne({
    model: db.Currency,
    data: { isPrimary: true },
    transaction,
  });

  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ["exchangeRate"],
    transaction,
  });

  const conversionRate =
    parseFloat(sourceExchangeRate.exchangeRate) / primaryCurrency.exchangeRate;
  amount = Math.abs((amount * conversionRate).toFixed(2));
  return { amount, conversionRate };
};

export const filterByDateCreatedAt = (
  query,
  startDate = null,
  endDate = null,
  modelName
) => {
  endDate = endDate || Date.now();

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.created_at`)),
          ">=",
          new Date(startDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.created_at`)),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.created_at`)),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  }

  return query;
};

export const getLastBet = async ({ actionType, gameId, transaction }) => {
  const lastBet = await getOne({
    model: db.CasinoTransaction,
    data: { actionType, gameId },
    order: [["createdAt", "DESC"]],
    transaction,
  });

  return lastBet;
};
