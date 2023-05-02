"use strict";
module.exports = (sequelize, DataTypes) => {
  const SuperAdminUserPermission = sequelize.define(
    "SuperAdminUserPermission",
    {
      superAdminUserPermissionId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      superAdminUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permission: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "super_admin_user_permissions",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );
  SuperAdminUserPermission.associate = function (models) {
    SuperAdminUserPermission.belongsTo(models.SuperAdminUser, {
      foreignKey: "superAdminUserId",
    });
  };
  return SuperAdminUserPermission;
};
