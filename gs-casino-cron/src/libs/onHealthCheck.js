import Logger from "../libs/logger";
import pubSubRedisClient from "./pubSubRedisClient";
import queueWorkerRedisClient from "./queueWorkerRedisClient";

export default async () => {
  let healthy = true;

  try {
    if (
      pubSubRedisClient.publisherClient.status === "ready" &&
      pubSubRedisClient.subscriberClient.status === "ready"
    ) {
      Logger.info("HealthCheck", {
        message: "Pub Sub Redis Connection: has been established successfully.",
      });
    } else {
      healthy = false;
      Logger.error("HealthCheck", {
        message: "Pub Sub Redis Connection: Failed to connect",
      });
    }

    if (
      queueWorkerRedisClient.publisherClient.status === "ready" &&
      queueWorkerRedisClient.subscriberClient.status === "ready"
    ) {
      Logger.info("HealthCheck", {
        message:
          "Queue Worker Redis Connection: has been established successfully.",
      });
    } else {
      healthy = false;
      Logger.error("HealthCheck", {
        message: "Queue Worker Redis Connection: Failed to connect",
      });
    }
  } catch (error) {
    Logger.error("HealthCheck", {
      message: "Redis Connection: Failed to connect",
      exception: error,
    });
    throw error;
  }

  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  if (healthy) {
    return healthCheck;
  } else {
    throw new Error();
  }
};
