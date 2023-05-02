"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "page_banners",
      {
        page_banner_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        image_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        redirect_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        banner_type: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
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
      {
        schema: "public",
      }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("page_banners", { schema: "public" });
  },
};
