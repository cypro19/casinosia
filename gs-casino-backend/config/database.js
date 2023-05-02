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
      max: 50,
      min: 0,
      idle: 5000,
      evict: 5000,
      acquire: 200000,
    },
    dialect: "postgres",
    timezone: "+1:00",
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
      ssl: false,
      //   require: true, // This will help you. But you will see nwe error
      //   rejectUnauthorized: false, // This line will fix new error
      // },
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
      max: 50,
      min: 0,
      idle: 5000,
      evict: 5000,
      acquire: 200000,
    },
    dialect: "postgres",
    timezone: "+1:00",
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
    define: {
      timestamps: false,
    },
  },
};
