"use strict";

module.exports = (sequelize, DataTypes) => {
  const CategoryGame = sequelize.define(
    "CategoryGame",
    {
      categoryGameId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      masterCasinoGameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      masterCasinoProviderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      returnToPlayer: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      wageringContribution: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "category_games",
      schema: "casino_system",
      timestamps: true,
      underscored: true,
    }
  );

  CategoryGame.associate = function (models) {
    CategoryGame.belongsTo(models.MasterCasinoGame, {
      foreignKey: "masterCasinoGameId",
    });
    CategoryGame.hasMany(models.FavoriteGame, {
      foreignKey: "categoryGameId",
      onDelete: "cascade",
      hooks: true,
    });
  };

  return CategoryGame;
};
