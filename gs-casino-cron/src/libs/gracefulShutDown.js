import closeQueues from "./closeQueues";
import pauseAndCloseQueues from "./pauseAndCloseQueues";

export default async function gracefulShutDown(signal) {
  console.log(`Received ${signal}`);

  setTimeout(async () => {
    console.warn("Couldn't pause all queues within 60s, sorry! Exiting.");
    await closeQueues();
    process.exit(1);
  }, 60000);

  await pauseAndCloseQueues();

  process.exit(0);
}
