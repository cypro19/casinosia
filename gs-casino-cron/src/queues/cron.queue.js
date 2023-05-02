import Bull from "bull";
import Redis from "ioredis";
import queueWorkerRedisClient from "../libs/queueWorkerRedisClient";

const opts = {
  // createClient: function (type, opts) {
  //   switch (type) {
  //     case "client":
  //       return queueWorkerRedisClient.client;
  //     case "subscriber":
  //       return queueWorkerRedisClient.publisherClient;
  //     default:
  //       return new Redis(opts);
  //   }
  // },
  // redis: queueWorkerRedisClient.connection,
  defaultJobOptions: {
    attempts: 3, // number retires
    backoff: 60000, // In Delayed State fo retries
    removeOnComplete: 10000,
  },
};

export const cronQueue = new Bull("Cron-Queue", {
  ...opts,
});

export const JOB_EXPIRE_BONUS = "ExpireBonus";

export const JOB_REINDEX_ELASTIC = "ElasticReindex";

export const JOB_RESET_LOGIN_COUNT = "ResetLoginCount";

export const JOB_AFFILIATE_CSV_UPLOAD = "MyAffiliateCsvUpload";

export const JOB_PAYMENT_UPDATE_TRANSACTION = "PaymentUpdateTransaction";
