"use strict";
module.exports = (sequelize, DataTypes) => {
  const Bonus = sequelize.define(
    "Bonus",
    {
      bonusId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      parentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        comment: "unique slug",
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      validTo: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      daysToClear: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      promotionTitle: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      bonusType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment:
          "match- Match Bonus, balance- balance bonus, freespins- spin bonus, deposit- deposit cashback bonus, wagering- wagering cashback bonus",
      },
      termCondition: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      currency: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      paymentMethods: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      depositBonusPercent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wageringRequirementType: {
        type: DataTypes.STRING,
        comment: "bonus:bonus, bonus deposit:bonus+deposit",
      },
      wageringMultiplier: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      wageringTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      validOnDays: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      allowAboveZero: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSticky: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      visibleInPromotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      claimedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      appliedBonusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "for balance bonus",
      },
      gameIds: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      description: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      bonusBetOnly: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      timePeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      other: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "bonus",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  Bonus.associate = function (models) {
    Bonus.belongsTo(models.WageringTemplate, {
      foreignKey: "wageringTemplateId",
    });
    Bonus.hasOne(models.UserBonus, { as: "userBonus", foreignKey: "bonusId" });
  };

  return Bonus;
};
