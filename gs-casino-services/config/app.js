import dotenv from "dotenv";
import convict from "convict";

dotenv.config();

const config = convict({
  app: {
    name: {
      doc: "Casino APIs",
      format: String,
      default: "Casino APIs",
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
  log_level: {
    doc: "level of logs to show",
    format: String,
    default: "debug",
    env: "LOG_LEVEL",
  },
  sequelize: {
    name: {
      default: "test_db",
      env: "DB_NAME",
    },
    user: {
      default: "dev_test",
      env: "DB_USER",
    },
    password: {
      default: "123456",
      env: "DB_PASSWORD",
    },
    host: {
      default: "localhost",
      env: "DB_HOST",
    },
    port: {
      default: 5433,
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
  swissSoft: {
    gcpUrl: {
      default: "",
      env: "SWISS_SOFT_GCP_URL",
    },
    accessToken: {
      default: "",
      env: "SWISS_SOFT_ACCESS_TOKEN",
    },
    accessToken2: {
      default: "",
      env: "SWISS_SOFT_ACCESS_TOKEN_2",
    },
    casinoId: {
      default: "",
      env: "SWISS_SOFT_CASINO_ID",
    },
  },
  elastic: {
    url: {
      default: "",
      env: "ELASTIC_URL",
    },
    user: {
      default: "",
      env: "ELASTIC_USER",
    },
    password: {
      default: "",
      env: "ELASTIC_PASSWORD",
    },
    httpCrtPath: {
      default: "",
      env: "ELASTIC_HTTP_CRT_PATH",
    },
    port: {
      default: "",
      env: "ELASTIC_PORT",
    },
  },
  microService: {
    accessToken: {
      default: "",
      env: "MICRO_SERVICE_ACCESS_TOKEN",
    },
  },
  userBeUrl: {
    default: "",
    env: "USER_BACKEND_ADDRESS",
  },
});
config.validate({ allowed: "strict" });

module.exports = config;
