import { cronQueue } from "../queues/cron.queue";
import Logger from "./logger";

export default async function () {
  await cronQueue.close();

  Logger.info("Close Queues", {
    message: "Closed all queues, exiting gracefully",
  });
}
