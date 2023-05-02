"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "super_admin_user_permissions",
      {
        super_admin_user_permission_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        super_admin_user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "super_admin_users",
            key: "super_admin_user_id",
          },
        },
        permission: {
          type: DataTypes.JSONB,
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
      { schema: "public" }
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("super_admin_user_permissions", {
      schema: "public",
    });
  },
};
