"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "master_casino_games",
      {
        master_casino_game_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        operator_status: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
        },
        is_active: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
        },
        master_casino_provider_id: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        master_game_sub_category_id: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        thumbnail_url: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        identifier: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        volatility_rating: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        has_freespins: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        restrictions: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        theme: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        feature_group: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        devices: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        lines: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        return_to_player: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        wagering_contribution: {
          type: DataTypes.DOUBLE,
          defaultValue: 100,
        },
        more_details: {
          type: DataTypes.STRING,
          allowNull: true,
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
      { schema: "casino_system" }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("master_casino_games", {
      schema: "casino_system",
    });
  },
};
