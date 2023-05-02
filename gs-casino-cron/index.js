import { createServer } from "http";
import config from "./src/configs/app.config";
import "./src/crons";
import "./src/json-schemas";
import gracefulShutDown from "./src/libs/gracefulShutDown";
import Logger from "./src/libs/logger";
import "./src/listeners";
import app from "./src/rest-resources";

const httpServer = createServer(app);

httpServer.listen({ port: config.get("port") }, () => {
  Logger.info("Server Started", {
    message: `Listening On ${config.get("port")}`,
  });
});

process.on("SIGTERM", gracefulShutDown);
process.on("SIGINT", gracefulShutDown);
process.on("SIGUSR2", gracefulShutDown);
