"use strict";
import { STATUS_VALUE } from "../../utils/constant";

module.exports = (sequelize, DataTypes) => {
  const UserBonus = sequelize.define(
    "UserBonus",
    {
      userBonusId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      bonusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bonusType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      freeSpinsQty: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bonusAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      amountToWager: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      wageredAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      wageringStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: STATUS_VALUE.PENDING,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: STATUS_VALUE.PENDING,
      },
      claimedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
        comment:
          "date of issuing bonus to player, or when player claims any bonus",
      },
      expireAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      issuerRole: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      issuerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      games: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      uniqueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      cashAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      amountConverted: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      betLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      primaryCurrencyAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      cancelledBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user_bonus",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  UserBonus.associate = function (models) {
    UserBonus.belongsTo(models.User, { foreignKey: "userId" });
    UserBonus.belongsTo(models.Bonus, { foreignKey: "bonusId", as: "bonus" });
  };

  return UserBonus;
};
