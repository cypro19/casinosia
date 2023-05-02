"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "users",
      {
        user_id: {
          autoIncrement: false,
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        date_of_birth: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        locale: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sign_in_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        sign_in_ip: {
          type: DataTypes.INET,
          allowNull: true,
        },
        parent_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        country_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tracking_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        is_affiliate_updated: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
        is_internal_user: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
        last_login_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        self_exclusion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        self_exclusion_updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        affiliate_status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: null,
        },
        disabled_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        disabled_by_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        disabled_by_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        disable_reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        unique_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        phone_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        new_password_key: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        new_password_requested: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        email_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        zip_code: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        affiliate_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        profile_image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        currency_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        kyc_status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        document_labels: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        requested_documents: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        logged_in: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        device_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        loyalty_points: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        tags: {
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
        deleted_at: {
          allowNull: true,
          type: DataTypes.DATE,
        },
      },
      { schema: "public" }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("users", { schema: "public" });
  },
};
