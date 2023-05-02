import "./router";
import cors from "cors";
import path from "path";
import express from "express";
import passport from "passport";
import db from "../app/db/models";
import initRoutes from "../routes";
import config from "../config/app";
import expressBoom from "express-boom";
import Logger from "../app/common/logger";
import initPassport from "../app/middlewares/passport";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

// Initialize express app
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const initMiddleware = () => {
  const enableCors = config.get("enableCors");
  // Enable cors
  if (enableCors === "true") {
    app.use(cors());
  }

  // Showing stack errors
  app.set("showStackError", true);
  // Configure view engine to render EJS templates.
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(expressBoom());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // To optimize the response performance
  app.use(passport.initialize());
  app.use(passport.session());
};

const initDatabase = () => {
  db.sequelize
    .sync({ force: config.get("sequelize.sync") })
    .then(() => {
      Logger.info("You are connected to the database successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const init = () => {
  // Initialize Express middleware
  initMiddleware();

  // Initialize Passport
  initPassport(passport);

  // Initialize modules server routes
  initRoutes(app);

  // Initialize database
  initDatabase();

  return app;
};
