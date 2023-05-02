"use strict";
module.exports = (sequelize, DataTypes) => {
  const Theme = sequelize.define(
    "Theme",
    {
      themeId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      themeName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      themeMode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      primaryColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secondaryColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      themeOptions: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "themes",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );
  Theme.associate = function (models) {
    Theme.hasMany(models.ThemeSetting, {
      as: "theme_settings",
      foreignKey: "themeId",
      onDelete: "cascade",
    });
  };
  return Theme;
};
