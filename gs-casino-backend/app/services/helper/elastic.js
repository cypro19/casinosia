import db from "../../db/models";
import { Op } from "sequelize";
import logger from "../../common/logger";
import { ACTION, TRANSACTION_STATUS } from "../../utils/constant";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";

export const MODEL_TYPE = {
  CASINO: "casino-transaction",
  BANKING: "transaction-banking",
};

export const createElasticEntity = async (record, elasticOptions) => {
  if (elasticClient === null) {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created <Connection Error>");
    return;
  }

  try {
    await elasticClient.ping();
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created <Connection Error>");
    return;
  }

  try {
    const options = elasticOptions.options;

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
    logger.info("Elastic entry created");
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created");
  }
};

export const updateElasticEntity = async (record, elasticOptions) => {
  if (elasticClient === null) {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created <Connection Error>");
    return;
  }

  try {
    await elasticClient.ping();
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created <Connection Error>");
    return;
  }

  try {
    const options = elasticOptions.options;
    const { transactionId, status, updatedAt } = record.dataValues;

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
    logger.info("Elastic entry created");
  } catch {
    await record
      .set({ elasticUpdated: false })
      .save({ hooks: false, transaction: elasticOptions.transaction });
    logger.error("Elastic entry not created");
  }
};

export const ELASTIC_MAPPINGS = {
  "casino-gaming-transactions": {
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
  userDetails,
  userWallet,
  conversionRate,
  game,
  amount,
  nonCashAmount,
}) => {
  if (amount) {
    nonCashAmount = 0;
  } else {
    amount = 0;
  }

  const elasticOptions = {
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    parentType: userDetails.parentType,
    parentId: userDetails.parentId,
    kycStatus: userDetails.kycStatus,
    totalAmount:
      parseInt(userWallet.amount) +
      parseInt(amount) +
      parseInt(userWallet.nonCashAmount),
    afterBalance: parseInt(userWallet.amount) + parseInt(amount),
    nonCashAmount: parseInt(userWallet.nonCashAmount) + parseInt(nonCashAmount),
    userCreatedAt: userDetails.createdAt,
    userUpdatedAt: userDetails.updatedAt,
    statusValue: "pending",
    description: null,
    gameAggregator: null,
    gameIdentifier: null,
    isFirstDeposit: false,
    bonusId: null,
    sourceCurrency: userWallet.currencyCode,
    targetCurrency: userWallet.currencyCode,
    amountInOtherCurrencies: null,
  };
  return elasticOptions;
};

export const getGameReportQuery = ({ query, startDate, endDate, groupBy }) => {
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } });
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } });

  const aggs = {
    date: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate,
              },
            },
          },
        },
      },
      aggs: {
        group_by_provider: {
          terms: {
            field: groupBy,
            size: 2147483647,
          },
          aggs: {
            totalBet: {
              filter: { term: { transactionType: ACTION.BET } },
              aggs: {
                group_by_user: {
                  terms: {
                    field: "user.userId",
                    size: 2147483647,
                  },
                },
                sum: {
                  sum: {
                    field: "transactionAmountPrimary",
                  },
                },
                count: {
                  value_count: {
                    field: "transactionId",
                  },
                },
              },
            },
            totalWin: {
              filter: { term: { transactionType: ACTION.WIN } },
              aggs: {
                sum: {
                  sum: {
                    field: "transactionAmountPrimary",
                  },
                },
              },
            },
            GGR: {
              bucket_script: {
                buckets_path: {
                  totalBet: "totalBet>sum",
                  totalWin: "totalWin>sum",
                },
                script: "params.totalBet - params.totalWin",
              },
            },
          },
        },
      },
    },
  };
  return { query, aggs };
};

export const getGameAggregatorAndProvider = async (game) => {
  const gameData = await db.MasterCasinoGame.findOne({
    where: { identifier: { [Op.iLike]: game } },
    attributes: ["masterCasinoGameId", "name", "thumbnailUrl"],
    include: [
      {
        model: db.MasterCasinoProvider,
        attributes: ["name"],
      },
    ],
    raw: true,
  });

  const returnData = {
    thumbnailUrl: gameData["thumbnailUrl"],
    provider: gameData["MasterCasinoProvider.name"],
    gameName: gameData["name"],
    gameId: gameData?.masterCasinoGameId,
  };

  return returnData;
};

export const createGameReport = async (gameReport, type, userId, limit) => {
  const response = [];

  for (const provider of gameReport.date.buckets.transactions.group_by_provider
    .buckets) {
    response.push({
      identifier: provider?.key,
      roundCount: provider.totalBet.count.value,
      ...(await getGameAggregatorAndProvider(provider?.key)),
    });
  }

  response.sort((a, b) => {
    return parseInt(b - a);
  });

  return response.slice(0, limit);
};

export const internationalNumberFormatter = (number) => {
  return new Intl.NumberFormat("en-EU").format(number);
};

export const topPlayerResponse = async (data, game) => {
  const response = [];

  data.forEach((object) => {
    const newData = {};
    Object.keys(object).forEach((key) => {
      const newKey = key.split(".")[key.split(".").length - 1];
      newData[newKey] = object[key];
      if (newKey === "amount") {
        newData[newKey] = internationalNumberFormatter(object[key]);
      }
    });
    response.push(newData);
  });

  if (game) {
    for (let index = 0; index < response.length; index++) {
      response[index] = {
        ...response[index],
        ...(await getGameAggregatorAndProvider(response[index].gameIdentifier)),
      };
    }
  }
  return response;
};
