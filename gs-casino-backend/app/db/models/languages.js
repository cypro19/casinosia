"use strict";
module.exports = function (sequelize, DataTypes) {
  const Language = sequelize.define(
    "Language",
    {
      languageId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      languageName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "languages",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  Language.associate = function (models) {};
  return Language;
};
