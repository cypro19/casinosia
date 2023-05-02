"use strict";
import {
  createElasticEntity,
  updateElasticEntity,
} from "../../services/common/elastic";
import { TRANSACTION_STATUS, AMOUNT_TYPE } from "../../utils/constant";

module.exports = (sequelize, DataTypes) => {
  const CasinoTransaction = sequelize.define(
    "CasinoTransaction",
    {
      casinoTransactionId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gameIdentifier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gameId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "game round id",
      },
      actionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      nonCashAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: TRANSACTION_STATUS.PENDING,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amountType: {
        type: DataTypes.INTEGER,
        defaultValue: AMOUNT_TYPE.CASH,
      },
      beforeBalance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      primaryCurrencyAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      afterBalance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      conversionRate: {
        type: DataTypes.DOUBLE,
      },
      elasticUpdated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isSticky: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userBonusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "casino_transactions",
      schema: "casino_system",
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

  CasinoTransaction.associate = function (models) {
    CasinoTransaction.belongsTo(models.Wallet, {
      foreignKey: "walletId",
    });
    CasinoTransaction.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return CasinoTransaction;
};
