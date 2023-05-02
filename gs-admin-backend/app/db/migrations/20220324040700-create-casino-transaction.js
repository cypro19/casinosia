"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "casino_transactions",
      {
        casino_transaction_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        transaction_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        action_type: {
          type: DataTypes.STRING,
        },
        action_id: {
          type: DataTypes.STRING,
        },
        amount: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
        },
        game_identifier: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        game_id: {
          type: DataTypes.STRING,
        },
        wallet_id: {
          type: DataTypes.INTEGER,
        },
        non_cash_amount: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.INTEGER,
        },
        admin_id: {
          type: DataTypes.INTEGER,
        },
        currency_code: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        before_balance: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        after_balance: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        primary_currency_amount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        amount_type: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        elastic_updated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        conversion_rate: {
          type: DataTypes.DOUBLE,
        },
        is_sticky: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        user_bonus_id: {
          type: DataTypes.INTEGER,
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
    await queryInterface.dropTable("casino_transactions", {
      schema: "casino_system",
    });
  },
};
