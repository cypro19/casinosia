"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "bonus",
      {
        bonus_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        parent_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        code: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          comment: "unique slug",
        },
        valid_from: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        valid_to: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        days_to_clear: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        promotion_title: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        bonus_type: {
          type: DataTypes.STRING,
          allowNull: false,
          comment:
            "match- Match Bonus, balance- balance bonus, freespins- spin bonus, deposit- deposit cashback bonus, wagering- wagering cashback bonus",
        },
        term_condition: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        currency: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        payment_methods: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        deposit_bonus_percent: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        wagering_requirement_type: {
          type: DataTypes.STRING,
          defaultValue: 0,
          comment: "bonus:bonus, bonusdeposit:bonus+deposit",
        },
        wagering_multiplier: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
        wagering_template_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        valid_on_days: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        allow_above_zero: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        is_sticky: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        visible_in_promotions: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        claimed_count: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        applied_bonus_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: "for balance bonus",
        },
        game_ids: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        time_period: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        bonus_bet_only: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        other: {
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
      {
        schema: "public",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bonus", { schema: "public" });
  },
};
