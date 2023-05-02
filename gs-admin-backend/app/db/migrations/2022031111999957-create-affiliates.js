"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "affiliates",
      {
        affiliate_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        first_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(255),
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(255),
        },
        admin_user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        affiliate_code: {
          type: DataTypes.UUID,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
        },
        payout_percentage: {
          type: DataTypes.INTEGER,
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
    await queryInterface.dropTable("affiliates", { schema: "public" });
  },
};
