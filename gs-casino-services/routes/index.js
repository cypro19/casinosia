import config from "../config/app";
import apiRoutes from "./api";

const initRoutes = (app) => {
  app.get("/", function (req, res, next) {
    const response = {
      success: 1,
      message: "Welcome to API " + config.get("app.name"),
      record: [],
    };
    res.json(response);
  });
  app.use(apiRoutes);

  app.get("/healthcheck", (req, res) => {
    res.sendStatus(200);
  });
};

export default initRoutes;
