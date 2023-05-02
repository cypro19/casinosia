import express from "express";
import onHealthCheck from "../../libs/onHealthCheck";
import basicAuthenticationMiddleware from "../middlewares/basicAuthentication.middleware";
import contextMiddleware from "../middlewares/context.middleware";
import apiRouter from "./api";
import dashboardRoutes from "./dashboard.routes";

const router = express.Router();

router.use("/dashboard", basicAuthenticationMiddleware, dashboardRoutes);
router.use("/api", basicAuthenticationMiddleware, contextMiddleware, apiRouter);

router.get("/health-check", async (req, res, next) => {
  try {
    const response = await onHealthCheck();
    res.json(response);
  } catch (error) {
    res.status(503);
    res.send();
  }
});

export default router;
