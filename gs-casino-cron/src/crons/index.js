import config from "../configs/app.config";
import {
  cronQueue,
  JOB_AFFILIATE_CSV_UPLOAD,
  JOB_EXPIRE_BONUS,
  JOB_PAYMENT_UPDATE_TRANSACTION,
  JOB_REINDEX_ELASTIC,
  JOB_RESET_LOGIN_COUNT,
} from "../queues/cron.queue";

cronQueue.add(
  JOB_AFFILIATE_CSV_UPLOAD,
  {},
  {
    repeat: { cron: config.get("cronTime.affiliateCsvUpload") },
  }
);

cronQueue.add(
  JOB_RESET_LOGIN_COUNT,
  {},
  {
    repeat: { cron: config.get("cronTime.resetLoginCount") },
  }
);

cronQueue.add(
  JOB_REINDEX_ELASTIC,
  {},
  {
    repeat: { cron: config.get("cronTime.elasticReIndex") },
  }
);

cronQueue.add(
  JOB_EXPIRE_BONUS,
  {},
  {
    repeat: { cron: config.get("cronTime.expireBonus") },
  }
);

cronQueue.add(
  JOB_PAYMENT_UPDATE_TRANSACTION,
  {},
  {
    repeat: { cron: config.get("cronTime.paymentUpdateTransactions") },
  }
);
