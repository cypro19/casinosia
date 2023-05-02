"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "multi_language_support",
      {
        multi_language_support_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        language: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        casino_banner_desc: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_banner_join_now: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_banner_tnc: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_favorite: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_no_fav_games_found: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_no_games_found: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_game_view_all_btn: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_search: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_more_games: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_providers: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_about: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_casino: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        casino_faq: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        footer_about_site: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        footer_rights_reserved: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        prom_banner_desc: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        prom_claim_now: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        prom_read_more: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_banner_desc: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_banner_join_now: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_banner_tnc: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_real_player_sec: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_current_winners: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_top_winners: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_top_games: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        home_testimonial: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {
        schema: "public",
      }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("multi_language_support", {
      schema: "public",
    });
  },
};
