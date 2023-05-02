"use strict";

import {
  createElasticEntity,
  updateElasticEntity,
} from "../../helpers/elastic.helpers";
import { AMOUNT_TYPE, TRANSACTION_STATUS } from "../../libs/constants";

module.exports = (sequelize, DataTypes) => {
  const TransactionBanking = sequelize.define(
    "TransactionBanking",
    {
      transactionBankingId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      actioneeType: {
        type: DataTypes.STRING,
      },
      actioneeId: {
        type: DataTypes.INTEGER,
      },
      actioneeEmail: {
        type: DataTypes.STRING,
      },
      actioneeName: {
        type: DataTypes.STRING,
      },
      targetId: {
        type: DataTypes.INTEGER,
      },
      walletId: {
        type: DataTypes.INTEGER,
      },
      currencyCode: {
        type: DataTypes.STRING,
      },
      conversionRate: {
        type: DataTypes.DOUBLE,
      },
      primaryCurrencyAmount: {
        type: DataTypes.FLOAT,
      },
      amountType: {
        type: DataTypes.INTEGER,
        defaultValue: AMOUNT_TYPE.CASH,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      beforeBalance: {
        type: DataTypes.DOUBLE,
      },
      paymentProvider: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: TRANSACTION_STATUS.PENDING,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      transactionDateTime: {
        type: DataTypes.STRING,
      },
      transactionType: {
        type: DataTypes.STRING,
      },
      isSuccess: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      errorDescription: {
        type: DataTypes.STRING,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
      paymentTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentTransactionName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isFirstDeposit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      elasticUpdated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "transaction_bankings",
      schema: "public",
      timestamps: true,
      underscored: true,
      hooks: {
        afterCreate: async (record, options) => {
          await createElasticEntity(record, options);
        },
        afterUpdate: async (record, options) => {
          await updateElasticEntity(record, options);
        },
      },
    }
  );
  TransactionBanking.associate = function (models) {
    TransactionBanking.belongsTo(models.Wallet, {
      as: "wallet",
      foreignKey: "walletId",
    });
    TransactionBanking.belongsTo(models.User, {
      foreignKey: "targetId",
      targetKey: "userId",
      constraints: false,
      as: "transactionUser",
    });
  };

  return TransactionBanking;
};
