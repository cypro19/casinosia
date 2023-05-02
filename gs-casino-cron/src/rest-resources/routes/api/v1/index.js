import express from "express";
import cronRouts from "./cron.routes";

const v1Router = express.Router();

v1Router.use("/cron", cronRouts);

export default v1Router;
