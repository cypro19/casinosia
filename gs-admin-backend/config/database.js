const config = require("./app");

module.exports = {
  development: {
    username: config.get("sequelize.user"),
    password: config.get("sequelize.password"),
    database: config.get("sequelize.name"),
    host: config.get("sequelize.host"),
    port: config.get("sequelize.port"),
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 60000,
      idle: 5000,
    },
    dialect: "postgres",
    timezone: "+1:00",
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
      ssl: false,
      //   require: false, // This will help you. But you will see nwe error
      //   rejectUnauthorized: false, // This line will fix new error
      // },
      requestTimeout: 3000,
    },
    define: {
      timestamps: false,
    },
  },
  staging: {
    username: config.get("sequelize.user"),
    password: config.get("sequelize.password"),
    database: config.get("sequelize.name"),
    host: config.get("sequelize.host"),
    port: config.get("sequelize.port"),
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 60000,
      idle: 5000,
    },
    dialect: "postgres",
    timezone: "+1:00",
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
      requestTimeout: 3000,
    },
    define: {
      timestamps: false,
    },
  },
};
