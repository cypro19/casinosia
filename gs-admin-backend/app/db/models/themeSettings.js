"use strict";
module.exports = (sequelize, DataTypes) => {
  const ThemeSetting = sequelize.define(
    "ThemeSetting",
    {
      themeSettingId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      themeAttr: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "custom parameters for theme(if any)",
      },
      logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      themeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "if use predefined theme, then id will store  else null",
      },
    },
    {
      sequelize,
      tableName: "theme_settings",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );
  ThemeSetting.associate = function (models) {
    ThemeSetting.belongsTo(models.Language, {
      as: "language",
      foreignKey: "languageId",
      onDelete: "cascade",
    });
    ThemeSetting.belongsTo(models.Theme, {
      as: "theme",
      foreignKey: "themeId",
      onDelete: "cascade",
    });
  };
  return ThemeSetting;
};
