"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "master_casino_providers",
      {
        master_casino_provider_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        is_active: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
        },
        master_game_aggregator_id: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        thumbnail_url: {
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
    await queryInterface.dropTable("master_casino_providers", {
      schema: "casino_system",
    });
  },
};
