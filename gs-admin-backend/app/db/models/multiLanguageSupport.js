"use strict";

module.exports = (sequelize, DataTypes) => {
  const MultiLanguageSupport = sequelize.define(
    "MultiLanguageSupport",
    {
      multiLanguageSupportId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      casinoBannerDesc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoBannerJoinNow: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoBannerTnc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoFavorite: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoNoFavGamesFound: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoNoGamesFound: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoGameViewAllBtn: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoSearch: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoMoreGames: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoProviders: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoAbout: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoCasino: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      casinoFaq: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      footerAboutSite: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      footerRightsReserved: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      promBannerDesc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      promClaimNow: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      promReadMore: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeBannerDesc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeBannerJoinNow: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeBannerTnc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeRealPlayerSec: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeCurrentWinners: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeTopWinners: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeTopGames: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homeTestimonial: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "multi_language_support",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  return MultiLanguageSupport;
};
