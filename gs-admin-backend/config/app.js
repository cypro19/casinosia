const convict = require("convict");

// Update path for dotenv file
require("dotenv").config();

const config = convict({
  app: {
    name: {
      doc: "Gammastack Gaming",
      format: String,
      default: "Gammastack Gaming",
    },
  },
  env: {
    doc: "The application environment.",
    format: ["production", "development", "staging", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 4000,
    env: "PORT",
  },
  enableCors: {
    doc: "add cors middleware for express",
    default: "false",
    env: "ENABLE_CORS",
  },
  log_level: {
    doc: "level of logs to show",
    format: String,
    default: "debug",
    env: "LOG_LEVEL",
  },
  webApp: {
    baseUrl: {
      default: "",
      env: "WEB_APP_BASE_URL",
    },
    baseUrlAlter: {
      default: "",
      env: "WEB_APP_BASE_URL_ALTER",
    },
    superadminDomain: {
      default: "",
      env: "SUPERADMIN_DOMAIN",
    },
    adminDomain: {
      default: "",
      env: "ADMIN_DOMAIN",
    },
  },
  sequelize: {
    name: {
      default: "casino_db",
      env: "DB_NAME",
    },
    user: {
      default: "postgres_database",
      env: "DB_USER",
    },
    password: {
      default: "postgres__database",
      env: "DB_PASSWORD",
    },
    host: {
      default: "localhost",
      env: "DB_HOST",
    },
    port: {
      default: 5432,
      env: "DB_PORT",
    },
    sync: {
      default: false,
      env: "DB_SYNC",
    },
  },
  logConfig: {
    maxSize: {
      default: "50m",
      env: "WINSTON_LOG_MAX_SIZE",
    },
    maxFiles: {
      default: "10d",
      env: "WINSTON_MAX_FILES_DURATION",
    },
    dirname: {
      default: "logs",
      env: "WINSTON_LOG_DIR",
    },
    datePattern: {
      default: "YYYY-MM-DD-HH",
      env: "WINSTON_FILE_NAME_DATE_PATTERN",
    },
    zippedArchive: {
      default: true,
      env: "WINSTON_ZIPPED_ARCHIVE",
    },
  },
  jwt: {
    loginTokenSecret: {
      default: "",
      env: "JWT_LOGIN_SECRET",
    },
    loginTokenExpiry: {
      default: "2d",
      env: "JWT_LOGIN_TOKEN_EXPIRY",
    },
    verificationTokenSecret: {
      default: "",
      env: "VERIFICATION_TOKEN_SECRET",
    },
    verificationTokenExpiry: {
      default: "120s",
      env: "VERIFICATION_TOKEN_EXPIRY",
    },
  },
  cookieMaxAge: {
    default: 1000 * 60 * 60 * 24,
    env: "COOKIE_MAX_AGE",
  },
  windowAge: {
    default: 1000 * 60 * 5,
    env: "WINDOW_AGE",
  },
});
config.validate({ allowed: "strict" });

module.exports = config;
