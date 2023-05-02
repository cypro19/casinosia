import logger from "../../common/logger";
import { ROLE } from "../../utils/constant";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";
import {
  getOtherCurrenciesAmount,
  getGameAggregatorAndProvider,
} from "../../utils/common";

export const MODEL_TYPE = {
  CASINO: "casino-transaction",
  BANKING: "transaction-banking",
};

export const createElasticEntity = async (record, elasticOptions) => {
  try {
    await elasticClient.ping();
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created");
    return;
  }

  const options = elasticOptions.options;
  const {
    casinoTransactionId,
    transactionBankingId,
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
    amountType,
    conversionRate,
    transactionId,
  } = record.dataValues;
  let modelType, txId, transactionIdString;

  try {
    if (casinoTransactionId) {
      modelType = MODEL_TYPE.CASINO;
      txId = casinoTransactionId;
      transactionIdString = casinoTransactionId.toString();
    } else {
      modelType = MODEL_TYPE.BANKING;
      txId = transactionBankingId;
      transactionIdString = transactionBankingId.toString();
    }

    await elasticClient.index({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
      document: {
        modelType,
        transactionId: txId,
        transactionIdString,
        transactionType: actionType,
        user: {
          userType: ROLE.USER,
          userId,
          walletId,
          firstName: options.firstName,
          lastName: options.lastName,
          username: options.username,
          email: options.email,
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
        afterBalance,
        nonCashAmount,
        conversionRate,
        status,
        isFirstDeposit: options.isFirstDeposit,
        kycStatus: options.kycStatus,
        statusValue: options.statusValue,
        description: options.description,
        currencyCode,
        countryCode: options.countryCode,
        gameAggregator: options.aggregator,
        gameIdentifier,
        gameProviderId: options.providerId,
        gameProvider: options.provider,
        paymentProvider: null,
        paymentMethod: options.paymentMethod,
        paymentTransactionId: options.paymentTransactionId,
        paymentTransactionName: options.paymentTransactionName,
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
    logger.info("Elastic entry created");
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created");
  }
};

export const updateElasticEntity = async (record, elasticOptions) => {
  try {
    await elasticClient.ping();
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not updated");
    return;
  }

  const options = elasticOptions.options;
  const {
    transactionId,
    amount,
    beforeBalance,
    afterBalance,
    status,
    updatedAt,
    primaryCurrencyAmount,
    nonCashAmount,
    conversionRate,
  } = record.dataValues;

  try {
    await elasticClient.update({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: transactionId,
      doc: {
        transactionAmount: amount,
        beforeBalance,
        afterBalance,
        nonCashAmount,
        status,
        conversionRate,
        transactionAmountPrimary: primaryCurrencyAmount,
        statusValue: options.statusValue,
        amountInOtherCurrencies: options.amountInOtherCurrencies,
        totalAmount: options.totalAmount,
        updatedAt,
      },
    });

    await record
      .set({ elasticUpdated: true })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.info("Elastic entry updated");
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not updated");
  }
};

export const ELASTIC_MAPPINGS = {
  "gaming-transactions": {
    mappings: {
      properties: {
        modelType: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        transactionId: {
          type: "integer",
        },
        transactionIdString: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        transactionType: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        parentId: {
          type: "float",
        },
        parentType: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        totalAmount: {
          type: "float",
        },
        amountType: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        transactionAmount: {
          type: "float",
        },
        transactionAmountPrimary: {
          type: "float",
        },
        afterBalance: {
          type: "float",
        },
        beforeBalance: {
          type: "float",
        },
        nonCashAmount: {
          type: "float",
        },
        conversionRate: {
          type: "float",
        },
        status: {
          type: "integer",
        },
        isFirstDeposit: {
          type: "boolean",
        },
        reindexed: {
          type: "boolean",
        },
        kycStatus: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        statusValue: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        description: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        currencyCode: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        countryCode: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        gameAggregator: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        gameIdentifier: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
          fielddata: true,
        },
        gameProviderId: {
          type: "integer",
        },
        gameProvider: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
          fielddata: true,
        },
        paymentProvider: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
          fielddata: true,
        },
        paymentMethod: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        paymentTransactionId: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        paymentTransactionName: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        bonusId: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        sourceCurrency: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        targetCurrency: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        amountInOtherCurrencies: {
          properties: {
            EUR: {
              type: "float",
            },
            INR: {
              type: "float",
            },
            JPY: {
              type: "float",
            },
            USD: {
              type: "float",
            },
          },
        },
        createdAt: {
          type: "date",
        },
        updatedAt: {
          type: "date",
        },
        user: {
          properties: {
            userType: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            userId: {
              type: "integer",
            },
            walletId: {
              type: "integer",
            },
            email: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            firstName: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            lastName: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            username: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            createdAt: {
              type: "date",
            },
            updatedAt: {
              type: "date",
            },
          },
        },
      },
    },
  },
};

export const getElasticOptions = async ({
  userExist,
  userWallet,
  game,
  amount,
  transaction,
}) => {
  const elasticOptions = {
    firstName: userExist.firstName,
    lastName: userExist.lastName,
    email: userExist.email,
    parentType: userExist.parentType,
    parentId: userExist.parentId,
    lastLoginDate: userExist.lastLoginDate,
    kycStatus: userExist.kycStatus,
    countryCode: userExist.countryCode,
    userCreatedAt: userExist.createdAt,
    userUpdatedAt: userExist.updatedAt,
    isFirstDeposit: false,
    username: userExist.username,
    statusValue: "completed",
    description: null,
    ...(await getGameAggregatorAndProvider({ game, transaction })),
    paymentMethod: null,
    paymentTransactionId: null,
    paymentTransactionName: null,
    bonusId: null,
    sourceCurrency: null,
    targetCurrency: null,
    amountInOtherCurrencies: await getOtherCurrenciesAmount({
      amount,
      currencyCode: userWallet.currencyCode,
      transaction,
    }),
  };

  return elasticOptions;
};
