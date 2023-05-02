"use strict";
module.exports = (sequelize, DataTypes) => {
  const FavoriteGame = sequelize.define(
    "FavoriteGame",
    {
      favoriteGameId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryGameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "favorite_games",
      schema: "casino_system",
      timestamps: true,
      underscored: true,
    }
  );
  FavoriteGame.associate = function (models) {
    FavoriteGame.belongsTo(models.User, {
      foreignKey: "userId",
    });
    FavoriteGame.belongsTo(models.CategoryGame, {
      as: "CategoryGames",
      foreignKey: "categoryGameId",
    });
  };
  return FavoriteGame;
};
