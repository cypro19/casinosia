// APPLICATION SPECIFIC
export const ACTION = {
  WIN: "win",
  BET: "bet",
  ROLLBACK: "rollback",
  ROLLBACKBEFOREBETWIN: "prerollback",
  FREESPINS: "freespins",
};

export const MONDAY = 1;

export const FIRST_DAY_OF_MONTH = 1;

export const STATUS_VALUE = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  REQUESTED: "REQUESTED",
  RE_REQUESTED: "RE-REQUESTED",
};

export const ROLE = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  USER: "user",
  AFFILIATE: "affiliate",
};

export const TRANSACTION_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
  FAILED: 3,
  ROLLBACK: 4,
  APPROVED: 5,
  REJECTED: 6,
};

export const WAGER_STATUS = {
  PENDING: "PENDING",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const KEYS = {
  MAX_BONUS_THRESHOLD: "maxBonusThreshold",
  MIN_DEPOSIT: "minDeposit",
  MAX_WIN_AMOUNT: "maxWinAmount",
  ZERO_OUT_THRESHOLD: "zeroOutThreshold",
  MIN_BALANCE: "minBalance",
};

export const TRANSACTION_TYPE = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  BONUS: "bonus",
  ADD_BALANCE: "addMoney",
  REMOVE_BALANCE: "removeMoney",
  BONUS_TO_CASH: "bonusToCash",
  ADD_BALANCE_INTERNAL: "addMoneyInternal",
  REMOVE_BALANCE_INTERNAL: "removeMoneyInternal",
};

export const CASINO_TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3,
};

export const AMOUNT_TYPE = {
  CASH: 0,
  NON_CASH: 1,
  CASH_NON_CASH: 2,
};

export const ACCOUNT_TYPE = "REAL";

export const FAILED = "failed";

export const BONUS_TYPE = {
  JOINING: "joining",
  FREESPINS: "freespins",
  DEPOSIT: "deposit",
  aliases: {
    freespins: "FREESPINS",
  },
};

export const BONUS_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  FORFEIT: "FORFEITED",
  EXPIRED: "EXPIRED",
  CLAIMING: "CLAIMING",
  IN_PROCESS: "IN-PROCESS",
  LAPSED: "LAPSED",
};

export const ELASTIC_INDEX = {
  TRANSACTIONS: "casino-gaming-transactions",
};

export const MODEL_TYPE = {
  CASINO: "casino-transaction",
  BANKING: "transaction-banking",
};

export const TYPE = {
  CRYPTO: "CRYPTO",
  FIAT: "FIAT",
  CRYPTO_ID: 0,
  FIAT_ID: 1,
};

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
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
