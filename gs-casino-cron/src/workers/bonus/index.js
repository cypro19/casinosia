import path from "path";
import { cronQueue, JOB_EXPIRE_BONUS } from "../../queues/cron.queue";

cronQueue.process(
  JOB_EXPIRE_BONUS,
  1,
  path.join(__dirname, "./expireBonus.worker")
);
