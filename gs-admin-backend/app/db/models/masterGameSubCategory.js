"use strict";

module.exports = (sequelize, DataTypes) => {
  const MasterGameSubCategory = sequelize.define(
    "MasterGameSubCategory",
    {
      masterGameSubCategoryId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      masterGameCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      iconColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#3e8ae2",
      },
      iconName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "FaBattleNet",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "master_game_sub_categories",
      schema: "casino_system",
      timestamps: true,
      underscored: true,
    }
  );

  MasterGameSubCategory.associate = function (model) {
    MasterGameSubCategory.belongsTo(model.MasterGameCategory, {
      foreignKey: "masterGameCategoryId",
    });
    MasterGameSubCategory.hasMany(model.MasterCasinoGame, {
      foreignKey: "masterGameSubCategoryId",
    });
  };

  return MasterGameSubCategory;
};
