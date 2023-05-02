import path from "path";
import { cronQueue, JOB_AFFILIATE_CSV_UPLOAD } from "../../queues/cron.queue";

cronQueue.process(
  JOB_AFFILIATE_CSV_UPLOAD,
  1,
  path.join(__dirname, "./csvUpload.worker")
);
