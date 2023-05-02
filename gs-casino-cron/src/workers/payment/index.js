import path from "path";
import {
  cronQueue,
  JOB_PAYMENT_UPDATE_TRANSACTION,
} from "../../queues/cron.queue";

cronQueue.process(
  JOB_PAYMENT_UPDATE_TRANSACTION,
  1,
  path.join(__dirname, "./updateTransactions.worker.js")
);
