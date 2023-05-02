"use strict";
import { TRANSACTION_STATUS } from "../../utils/constant";

module.exports = function (sequelize, DataTypes) {
  const WithdrawRequest = sequelize.define(
    "WithdrawRequest",
    {
      withdrawRequestId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: TRANSACTION_STATUS.PENDING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionableType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionableId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      actionedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paymentProvider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "withdraw_requests",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  WithdrawRequest.associate = function (model) {
    WithdrawRequest.belongsTo(model.User, { foreignKey: "userId" });
  };

  return WithdrawRequest;
};
