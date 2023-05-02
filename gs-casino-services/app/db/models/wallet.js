"use strict";

module.exports = function (sequelize, DataTypes) {
  const Wallet = sequelize.define(
    "Wallet",
    {
      walletId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0,
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nonCashAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0,
      },
      totalAmount: {
        type: DataTypes.VIRTUAL,
        get() {
          return parseFloat(
            (parseInt(this.amount) + parseInt(this.nonCashAmount)).toFixed(2)
          );
        },
      },
    },
    {
      sequelize,
      tableName: "wallets",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  Wallet.associate = function (model) {
    Wallet.hasMany(model.TransactionBanking, {
      as: "transactionBankings",
      foreignKey: "walletId",
      onDelete: "cascade",
    });
    Wallet.belongsTo(model.User, {
      foreignKey: "ownerId",
      constraints: false,
    });
    Wallet.hasMany(model.CasinoTransaction, {
      as: "casinoTransactions",
      foreignKey: "walletId",
      onDelete: "cascade",
    });
  };

  return Wallet;
};
