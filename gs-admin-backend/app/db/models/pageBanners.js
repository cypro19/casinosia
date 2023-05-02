"use strict";
module.exports = (sequelize, DataTypes) => {
  const PageBanner = sequelize.define(
    "PageBanner",
    {
      pageBannerId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      redirectUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bannerType: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "page_banners",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );
  PageBanner.associate = function (models) {
    // associations can be defined here
  };
  return PageBanner;
};
