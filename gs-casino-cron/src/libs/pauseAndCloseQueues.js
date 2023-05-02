import { cronQueue } from "../queues/cron.queue";
import Logger from "./logger";

export default async function () {
  await cronQueue.pause(true);
  await cronQueue.close();

  Logger.info("Pause and Close Queues", {
    message: "Paused all queues, exiting gracefully",
  });
}
