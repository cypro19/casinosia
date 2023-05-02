"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "themes",
      {
        theme_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        theme_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        theme_mode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        primary_color: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        secondary_color: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        theme_options: {
          type: DataTypes.JSONB,
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
      { schema: "public" }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("themes", { schema: "public" });
  },
};
