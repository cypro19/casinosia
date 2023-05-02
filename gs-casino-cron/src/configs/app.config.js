import dotenv from "dotenv";
import convict from "convict";

dotenv.config();

const config = convict({
  app: {
    name: {
      doc: "Name of the service",
      format: String,
      default: "Game Engine",
      env: "APP_NAME",
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
    default: 8080,
    env: "PORT",
  },

  basic_auth: {
    username: {
      doc: "Basic Auth User Name",
      format: String,
      default: "rome_username",
      env: "BASIC_AUTH_USERNAME",
    },
    password: {
      doc: "Basic Auth User Password",
      format: String,
      default: "rome_password",
      env: "BASIC_AUTH_PASSWORD",
    },
  },

  db: {
    name: {
      doc: "Database Name",
      format: String,
      default: "api",
      env: "DB_NAME",
    },
    username: {
      doc: "Database user",
      format: String,
      default: "postgres",
      env: "DB_USERNAME",
    },
    password: {
      doc: "Database password",
      format: "*",
      default: "postgres",
      env: "DB_PASSWORD",
    },
    host: {
      doc: "DB host",
      format: String,
      default: "127.0.0.1",
      env: "DB_HOST",
    },
    port: {
      doc: "DB PORT",
      format: "port",
      default: "5432",
      env: "DB_PORT",
    },
  },

  queue_worker_redis_db: {
    password: {
      doc: "Redis Database password",
      format: "*",
      default: "",
      env: "QUEUE_WORKER_REDIS_DB_PASSWORD",
    },
    host: {
      doc: "Redis DB host",
      format: String,
      default: "127.0.0.1",
      env: "QUEUE_WORKER_REDIS_DB_HOST",
    },
    port: {
      doc: "Redis DB PORT",
      format: "port",
      default: 6379,
      env: "QUEUE_WORKER_REDIS_DB_PORT",
    },
  },

  pub_sub_redis_db: {
    password: {
      doc: "Redis Database password",
      format: "*",
      default: "",
      env: "PUB_SUB_REDIS_DB_PASSWORD",
    },
    host: {
      doc: "Redis DB host",
      format: String,
      default: "127.0.0.1",
      env: "PUB_SUB_REDIS_DB_HOST",
    },
    port: {
      doc: "Redis DB PORT",
      format: "port",
      default: 6379,
      env: "PUB_SUB_REDIS_DB_PORT",
    },
  },

  myAffiliateFTP: {
    host: {
      default: "",
      env: "MYAFFILIATE_FTP_HOST",
    },
    port: {
      default: "",
      env: "MYAFFILIATE_FTP_PORT",
    },
    user: {
      default: "",
      env: "MYAFFILIATE_FTP_USER",
    },
    password: {
      default: "",
      env: "MYAFFILIATE_FTP_PASSWORD",
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

  cronTime: {
    affiliateCsvUpload: {
      default: "15 */3 * * *",
      env: "CRON_TIME_AFFILIATE_CSV_UPLOAD",
    },
    resetLoginCount: {
      default: "0 0 * * *",
      env: "CRON_TIME_RESET_LOGIN_COUNT",
    },
    elasticReIndex: {
      default: "5 */6 * * *",
      env: "CRON_TIME_ELASTIC_RE_INDEX",
    },
    expireBonus: {
      default: "10 0 * * *",
      env: "CRON_TIME_EXPIRE_BONUS",
    },
    paymentUpdateTransactions: {
      default: "20 0 * * *",
      env: "CRON_TIME_PAYMENT_UPDATE_TRANSACTIONS",
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

  log_level: {
    doc: "level of logs to show",
    format: String,
    default: "debug",
    env: "LOG_LEVEL",
  },
});

config.validate({ allowed: "strict" });

export default config;
