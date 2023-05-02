import "./router";
import cors from "cors";
import path from "path";
import express from "express";
import db from "../app/db/models";
import initRoutes from "../routes";
import config from "../config/app";
import expressBoom from "express-boom";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import Logger from "../app/common/logger";

// Initialize express app
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const corsConfiguration = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const initMiddleware = () => {
  // Enable cors
  app.use(cors(corsConfiguration));
  // Showing stack errors
  app.set("showStackError", true);

  // Configure view engine to render EJS templates.
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(expressBoom());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // To optimize the response performance
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
