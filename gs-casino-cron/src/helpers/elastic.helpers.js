import db from "../db/models";
import Logger from "../libs/logger";
import {
  ELASTIC_INDEX,
  MODEL_TYPE,
  ROLE,
  TRANSACTION_STATUS,
} from "../libs/constants";

export const getGameAggregatorAndProvider = async ({ game }) => {
  const gameData = await db.MasterCasinoGame.findOne({
    where: { identifier: game },
    attributes: [],
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
    ],
    raw: true,
  });

  if (gameData === null) {
    return { aggregator: null, provider: null, providerId: null };
  }

  return {
    aggregator: gameData["MasterCasinoProvider.MasterGameAggregator.name"],
    provider: gameData["MasterCasinoProvider.name"],
    providerId: gameData["MasterCasinoProvider.masterCasinoProviderId"],
  };
};

export const createElasticDataBanking = async ({
  transaction,
  elasticClient,
}) => {
  const {
    transactionBankingId,
    actioneeType,
    actioneeId,
    actioneeEmail,
    actioneeName,
    walletId,
    currencyCode,
    conversionRate,
    primaryCurrencyAmount,
    amountType,
    amount,
    beforeBalance,
    paymentProvider,
    status,
    countryCode,
    transactionId,
    transactionType,
    paymentMethod,
    paymentTransactionId,
    paymentTransactionName,
    isFirstDeposit,
    updatedAt,
    createdAt,
  } = transaction.dataValues;

  if (
    await elasticClient.exists({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
    })
  ) {
    await elasticClient.delete({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
    });
  }

  const user = transaction.transactionUser.dataValues;
  const wallet = transaction.transactionUser.userWallet.dataValues;

  try {
    await elasticClient.index({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
      document: {
        modelType: MODEL_TYPE.BANKING,
        transactionId: transactionBankingId,
        transactionIdString: transactionBankingId.toString(),
        transactionType: transactionType,
        user: {
          userType: actioneeType,
          userId: actioneeId,
          walletId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: actioneeName,
          email: actioneeEmail,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        parentType: user.parentType,
        parentId: user.parentId,
        totalAmount:
          parseInt(wallet.amount) +
          parseInt(amount) +
          parseInt(wallet.nonCashAmount),
        amountType,
        transactionAmount: amount,
        transactionAmountPrimary: primaryCurrencyAmount,
        beforeBalance,
        afterBalance: parseInt(wallet.amount) + parseInt(amount),
        nonCashAmount: wallet.nonCashAmount,
        conversionRate,
        isFirstDeposit,
        status,
        kycStatus: user.kycStatus,
        statusValue: Object.keys(TRANSACTION_STATUS)
          .find((key) => TRANSACTION_STATUS[key] === status)
          .toLowerCase(),
        description: null,
        currencyCode,
        countryCode,
        gameAggregator: null,
        gameIdentifier: null,
        paymentProvider: paymentProvider,
        gameProvider: null,
        gameProviderId: null,
        paymentMethod,
        paymentTransactionId,
        paymentTransactionName,
        bonusId: null,
        sourceCurrency: wallet.currencyCode,
        targetCurrency: wallet.currencyCode,
        amountInOtherCurrencies: null,
        reindexed: true,
        updatedAt,
        createdAt,
      },
    });

    await transaction.set({ elasticUpdated: true }).save({ hooks: false });
  } catch (error) {
    Logger.error("Transaction Banking", {
      message: "Unable to re-index transaction",
      exception: error,
    });
  }
};

export const createElasticDataCasino = async ({
  transaction,
  elasticClient,
}) => {
  const {
    casinoTransactionId,
    userId,
    walletId,
    gameIdentifier,
    actionType,
    amount,
    nonCashAmount,
    status,
    currencyCode,
    beforeBalance,
    afterBalance,
    primaryCurrencyAmount,
    updatedAt,
    createdAt,
    conversionRate,
    amountType,
    transactionId,
  } = transaction.dataValues;

  if (
    await elasticClient.exists({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
    })
  ) {
    await elasticClient.delete({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
    });
  }

  const user = transaction.User.dataValues;

  const gameDetails = await getGameAggregatorAndProvider({
    game: gameIdentifier,
  });

  try {
    await elasticClient.index({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
      document: {
        modelType: MODEL_TYPE.CASINO,
        transactionId: casinoTransactionId,
        transactionIdString: casinoTransactionId.toString(),
        transactionType: actionType,
        user: {
          userType: ROLE.USER,
          userId,
          walletId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        parentType: user.parentType,
        parentId: user.parentId,
        totalAmount: parseInt(afterBalance) + parseInt(nonCashAmount),
        amountType,
        transactionAmount: amount,
        transactionAmountPrimary: primaryCurrencyAmount,
        beforeBalance,
        afterBalance,
        nonCashAmount,
        conversionRate,
        isFirstDeposit: false,
        status,
        kycStatus: user.kycStatus,
        statusValue: Object.keys(TRANSACTION_STATUS)
          .find((key) => TRANSACTION_STATUS[key] === status)
          .toLowerCase(),
        description: null,
        currencyCode,
        countryCode: user.countryCode,
        gameAggregator: gameDetails.aggregator,
        gameIdentifier,
        gameProvider: gameDetails.provider,
        gameProviderId: gameDetails.providerId,
        paymentProvider: null,
        paymentMethod: null,
        paymentTransactionId: null,
        paymentTransactionName: null,
        bonusId: null,
        sourceCurrency: null,
        targetCurrency: null,
        amountInOtherCurrencies: null,
        reindexed: true,
        updatedAt,
        createdAt,
      },
    });

    await transaction.set({ elasticUpdated: true }).save({ hooks: false });
  } catch (error) {
    Logger.error("Casino Transactions", {
      message: "Unable to re-index transaction",
      exception: error,
    });
  }
};

export const createElasticEntity = async (record, elasticOptions) => {
  const options = elasticOptions.options;
  const { elasticClient } = elasticOptions.options;

  if (elasticClient === null) {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    return;
  }

  const {
    transactionBankingId,
    actioneeType,
    actioneeId,
    actioneeEmail,
    actioneeName,
    walletId,
    currencyCode,
    conversionRate,
    primaryCurrencyAmount,
    amountType,
    amount,
    beforeBalance,
    paymentProvider,
    status,
    countryCode,
    transactionId,
    transactionType,
    paymentMethod,
    paymentTransactionId,
    paymentTransactionName,
    updatedAt,
    createdAt,
  } = record.dataValues;

  try {
    await elasticClient.index({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
      document: {
        modelType: MODEL_TYPE.BANKING,
        transactionId: transactionBankingId,
        transactionIdString: transactionBankingId.toString(),
        transactionType: transactionType,
        user: {
          userType: actioneeType,
          userId: actioneeId,
          walletId,
          firstName: options.firstName,
          lastName: options.lastName,
          username: actioneeName,
          email: actioneeEmail,
          createdAt: options.userCreatedAt,
          updatedAt: options.userUpdatedAt,
        },
        parentType: options.parentType,
        parentId: options.parentId,
        totalAmount: options.totalAmount,
        amountType,
        transactionAmount: amount,
        transactionAmountPrimary: primaryCurrencyAmount,
        beforeBalance,
        afterBalance: options.afterBalance,
        nonCashAmount: options.nonCashAmount,
        conversionRate,
        isFirstDeposit: options.isFirstDeposit,
        status,
        kycStatus: options.kycStatus,
        statusValue: options.statusValue,
        description: options.description,
        currencyCode,
        countryCode,
        gameAggregator: options.aggregator,
        gameIdentifier: options.gameIdentifier,
        gameProvider: null,
        gameProviderId: null,
        paymentProvider: paymentProvider,
        paymentMethod,
        paymentTransactionId,
        paymentTransactionName,
        bonusId: options.bonusId,
        sourceCurrency: options.sourceCurrency,
        targetCurrency: options.targetCurrency,
        amountInOtherCurrencies: options.amountInOtherCurrencies,
        reindexed: false,
        updatedAt,
        createdAt,
      },
    });

    await record
      .set({ elasticUpdated: true })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    Logger.info("Transaction Hook", { message: "Elastic Entry Created" });
  } catch (error) {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    Logger.error("Transaction Hook", {
      message: "Elastic Entry Not Created",
      exception: error,
    });
  }
};

export const updateElasticEntity = async (record, elasticOptions) => {
  const options = elasticOptions.options;
  const { transactionId, status, updatedAt } = record.dataValues;
  const { elasticClient } = elasticOptions.options;

  if (elasticClient === null) {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    return;
  }

  try {
    await elasticClient.update({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
      doc: {
        status,
        statusValue: options.statusValue,
        updatedAt,
      },
    });

    await record
      .set({ elasticUpdated: true })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    Logger.info("Transaction Hook", { message: "Elastic Entry Updated" });
  } catch (error) {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    Logger.error("Transaction Hook", {
      message: "Elastic Entry Not Updated",
      exception: error,
    });
  }
};
