import "./router";
import cors from "cors";
import express from "express";
import db from "../app/db/models";
import initRoutes from "../routes";
import config from "../config/app";
import expressBoom from "express-boom";
import Logger from "../app/common/logger";

// Initialize express app
const app = express();

const initMiddleware = () => {
  // Enable cors
  app.use(cors());
  // Showing stack errors
  app.set("showStackError", true);

  app.use(expressBoom());

  // To optimize the response performance
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const initDatabase = () => {
  db.sequelize.sync({ force: config.get("sequelize.sync") }).then(() => {
    Logger.info("You are connected to the database successfully");
  });
};

export const init = () => {
  // Initialize Express middleware
  initMiddleware();

  // Initialize modules server routes
  initRoutes(app);

  // Initialize database
  initDatabase();

  return app;
};
