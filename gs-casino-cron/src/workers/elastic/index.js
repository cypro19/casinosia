import path from "path";
import {
  cronQueue,
  JOB_REINDEX_ELASTIC,
  JOB_RESET_LOGIN_COUNT,
} from "../../queues/cron.queue";

cronQueue.process(
  JOB_REINDEX_ELASTIC,
  1,
  path.join(__dirname, "./reindexElastic.worker")
);

cronQueue.process(
  JOB_RESET_LOGIN_COUNT,
  1,
  path.join(__dirname, "./resetLoginCount.worker")
);
