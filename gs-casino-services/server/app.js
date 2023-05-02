import db from "../app/db/models";
import config from "../config/app";
import * as express from "./express";
import Logger from "../app/common/logger";
import { elasticClient } from "./elasticClient";

const closeAllProcesses = async (server) => {
  Logger.custom("verbose", "[Close server] Graceful shutdown server...");
  try {
    await server.close();

    Logger.custom("verbose", "--Express server closed--");
  } catch (error) {
    Logger.error(`Error occurred while closing the Express server ${error}`);
  }

  try {
    await elasticClient.close();

    Logger.custom("verbose", "--Elastic server connection closed--");
  } catch (error) {
    Logger.error(
      `Error occurred while closing the Elastic server connection${error}`
    );
  }

  try {
    await db.sequelize.close();

    Logger.custom("verbose", "--Database connection server closed--");
  } catch (error) {
    Logger.error(
      `Error occurred while closing the Database server connection${error}`
    );
  }

  process.exit(0);
};

const start = async () => {
  const port = config.get("port");
  const appStartMessage = () => {
    // eslint-disable-next-line no-unused-vars
    console.log("Server listening on port", port);
  };

  const app = express.init();
  const server = app.listen(port, appStartMessage);

  process.on("SIGTERM", async () => await closeAllProcesses(server));
  process.on("SIGINT", async () => await closeAllProcesses(server));
};

export default start;
