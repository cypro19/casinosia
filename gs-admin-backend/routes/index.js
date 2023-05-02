import apiRoutes from "./api";

const initRoutes = (app) => {
  app.get("/api/ok", function (req, res, next) {
    const response = {
      success: 1,
      message: "Welcome to API " + process.env.APP_NAME,
      record: [],
    };
    res.json(response);
  });
  app.use(apiRoutes);

  app.get("/api/health", (req, res) => {
    res.sendStatus(200);
  });
};

export default initRoutes;
