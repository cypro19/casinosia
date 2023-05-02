import "reflect-metadata";
import * as server from "./server";

const logErrors = (error) => {
  server.logger.error(error.message, { stack: error.stack });
  throw error;
};
process.on("uncaughtException ", logErrors);
process.on("unhandledRejection", (error) => {
  server.logger.error(error);
});
server.app.start();
server.logger.custom("verbose", "server main");
