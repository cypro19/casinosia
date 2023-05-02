const convict = require("convict");

// Update path for dotenv file
require("dotenv").config();

const config = convict({
  app: {
    name: {
      doc: "User BE",
      format: String,
      default: "User BE",
    },
  },
  env: {
    doc: "The application environment.",
    format: ["production", "development", "staging", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  credentialsEncryptionKey: {
    default: "",
    env: "CREDENTIAL_ENCRYPTION_KEY",
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
  myAffiliate: {
    apiUsername: {
      default: "",
      env: "MY_AFFILIATES_API_USERNAME",
    },
    apiPassword: {
      default: "",
      env: "MY_AFFILIATES_API_PASSWORD",
    },
    apiUrl: {
      default: "",
      env: "MY_AFFILIATES_API",
    },
  },
  socket: {
    encryptionKey: {
      default: "",
      env: "SOCKET_ENCRYPTION_KEY",
    },
    maxPerUserConnection: {
      default: 2,
      env: "SOCKET_MAX_PER_USER_CONNECTION",
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
  microService: {
    accessToken: {
      default: "",
      env: "MICRO_SERVICE_ACCESS_TOKEN",
    },
    url: {
      default: "",
      env: "MICRO_SERVICE_URL",
    },
  },
  cognito: {
    userPoolId: {
      default: "",
      env: "COGNITO_USER_POOL_ID",
    },
    clientId: {
      default: "",
      env: "COGNITO_CLIENT_ID",
    },
  },
  jwt: {
    secretKey: {
      default: "",
      env: "SECRET_KEY",
    },
    emailTokenExpiry: {
      default: "",
      env: "EMAIL_TOKEN_EXPIRY",
    },
    emailTokenKey: {
      default: "",
      env: "EMAIL_TOKEN_KEY",
    },
    resetPasswordExpiry: {
      default: "",
      env: "RESET_PASSWORD_EXPIRY",
    },
  },
  swissSoft: {
    gcpUrl: {
      default: "",
      env: "SWISS_SOFT_GCP_URL",
    },
    accessToken1: {
      default: "",
      env: "SWISS_SOFT_ACCESS_TOKEN_1",
    },
    accessToken2: {
      default: "",
      env: "SWISS_SOFT_ACCESS_TOKEN_2",
    },
  },
  elastic: {
    ip: {
      default: "",
      env: "ELASTIC_IP",
    },
    user: {
      default: "",
      env: "ELASTIC_USER",
    },
    password: {
      default: "",
      env: "ELASTIC_PASSWORD",
    },
    port: {
      default: "",
      env: "ELASTIC_PORT",
    },
  },
  aws: {
    accessKey: {
      default: "",
      env: "AWS_ACCESS_KEY",
    },
    secretAccessKey: {
      default: "",
      env: "AWS_SECRET_ACCESS_KEY",
    },
    bucket: {
      default: "",
      env: "AWS_BUCKET",
    },
  },
  paymentIq: {
    merchantId: {
      default: "",
      env: "MERCHANT_ID",
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
