import express from "express";
import routes from "../rest-resources/routes";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";

const app = express();

app.use(routes);

app.use(async (req, res) => {
  res.status(404).json({ status: "Not Found" });
});

app.use(errorHandlerMiddleware);

export default app;
