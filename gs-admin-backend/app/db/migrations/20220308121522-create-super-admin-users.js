"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "super_admin_users",
      {
        super_admin_user_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "",
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "",
        },
        reset_password_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        reset_password_sent_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        remember_created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        super_role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        parent_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        remember_token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        super_admin_username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        group: {
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
      { schema: "public" }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("super_admin_users", { schema: "public" });
  },
};
