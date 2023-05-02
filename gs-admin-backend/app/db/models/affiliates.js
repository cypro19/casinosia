"use strict";
module.exports = function (sequelize, DataTypes) {
  const Affiliate = sequelize.define(
    "Affiliate",
    {
      affiliateId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(255),
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(255),
      },
      adminUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      affiliateCode: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      payoutPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "affiliates",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );
  Affiliate.associate = function (model) {
    Affiliate.hasMany(model.User, {
      as: "users",
      foreignKey: "affiliateId",
      onDelete: "cascade",
    });
    Affiliate.hasMany(model.TransactionAffiliate, {
      as: "transactionAffiliates",
      foreignKey: "affiliateId",
    });
  };
  return Affiliate;
};
