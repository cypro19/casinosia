"use strict";
import { ROLE, STATUS_VALUE } from "../../libs/constants";

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      userId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      uniqueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      signInCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      signInIp: {
        type: DataTypes.INET,
        allowNull: true,
      },
      parentType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      selfExclusion: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      selfExclusionUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disabledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disabledByType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      disabledById: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      disableReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      newPasswordKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      newPasswordRequested: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      affiliateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kycStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: STATUS_VALUE.PENDING,
      },
      documentLabels: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      requestedDocuments: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      loyaltyPoints: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      loggedIn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deviceType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      affiliateStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      trackingToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      isAffiliateUpdated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      schema: "public",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  User.associate = function (model) {
    User.hasMany(model.WithdrawRequest, {
      as: "withdrawRequests",
      foreignKey: "userId",
      onDelete: "cascade",
    });
    User.hasOne(model.Wallet, {
      foreignKey: "ownerId",
      as: "userWallet",
      constraints: false,
      scope: {
        ownerType: ROLE.USER,
      },
      onDelete: "cascade",
    });
    User.hasMany(model.UserBonus, {
      as: "bonus",
      foreignKey: "userId",
      onDelete: "cascade",
    });
    User.hasMany(model.CasinoTransaction, {
      as: "casinoTransactions",
      foreignKey: "userId",
      onDelete: "cascade",
    });
    User.hasMany(model.TransactionBanking, {
      sourceKey: "userId",
      foreignKey: "targetId",
      as: "transactions",
    });
  };

  return User;
};
