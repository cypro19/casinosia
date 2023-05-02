"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable(
      "super_admin_roles",
      {
        super_role_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        abbr: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        level: {
          type: DataTypes.SMALLINT,
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
    await queryInterface.dropTable("super_admin_roles", { schema: "public" });
  },
};
