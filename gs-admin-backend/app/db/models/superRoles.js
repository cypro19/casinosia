"use strict";
module.exports = (sequelize, DataTypes) => {
  const SuperadminRole = sequelize.define(
    "SuperadminRole",
    {
      superRoleId: {
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
    },
    {
      sequelize,
      tableName: "super_admin_roles",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  SuperadminRole.associate = function (models) {
    SuperadminRole.hasMany(models.SuperAdminUser, {
      foreignKey: "superRoleId",
      as: "superAdminUser",
    });
  };
  return SuperadminRole;
};
