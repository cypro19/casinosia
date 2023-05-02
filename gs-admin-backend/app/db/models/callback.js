"use strict";

module.exports = (sequelize, DataTypes) => {
  const Callback = sequelize.define(
    "Callback",
    {
      callbackId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      callbackFrom: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "callbacks",
      schema: "casino_system",
      timestamps: true,
      underscored: true,
    }
  );

  return Callback;
};
