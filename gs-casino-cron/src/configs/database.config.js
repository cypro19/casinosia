import config from "./app.config";

module.exports = {
  development: {
    username: config.get("db.username"),
    password: config.get("db.password"),
    database: config.get("db.name"),
    host: config.get("db.host"),
    port: config.get("db.port"),
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
  staging: {
    username: config.get("db.username"),
    password: config.get("db.password"),
    database: config.get("db.name"),
    host: config.get("db.host"),
    port: config.get("db.port"),
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
