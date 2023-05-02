"use strict";

module.exports = (sequelize, DataTypes) => {
  const SuperAdminUser = sequelize.define(
    "SuperAdminUser",
    {
      superAdminUserId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rememberCreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      superRoleId: {
        type: DataTypes.INTEGER,
      },
      parentType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rememberToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      superAdminUsername: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "super_admin_users",
      modelName: "SuperAdminUser",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  SuperAdminUser.associate = function (models) {
    SuperAdminUser.belongsTo(models.SuperadminRole, {
      foreignKey: "superRoleId",
    });
    SuperAdminUser.hasOne(models.SuperAdminUserPermission, {
      as: "userPermission",
      foreignKey: "superAdminUserId",
      onDelete: "cascade",
    });
  };
  return SuperAdminUser;
};
