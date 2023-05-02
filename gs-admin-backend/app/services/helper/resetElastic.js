const { Client } = require("@opensearch-project/opensearch");

require("dotenv").config();

const ELASTIC_INDEX = {
  TRANSACTIONS: "casino-gaming-transactions",
};

const ELASTIC_MAPPINGS = {
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
            // userId: {
            //   type: "text",
            // },
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

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
  },
  ssl: {
    // ca: fs.readFileSync(process.env.ELASTIC_HTTP_CRT_PATH),
    rejectUnauthorized: false,
  },
});

module.exports.resetIndexes = async () => {
  try {
    await client.indices.delete({ index: ELASTIC_INDEX.TRANSACTIONS });
  } catch (err) {
    console.log("Index does not exist");
  }

  await client.indices.create({
    index: ELASTIC_INDEX.TRANSACTIONS,
    body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS],
  });
};
