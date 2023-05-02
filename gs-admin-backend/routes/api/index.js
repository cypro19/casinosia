import express from "express";
import { adminRouter } from "./admin.router";

const router = express.Router();
const NAMESPACE = "api";

router.use(`/${NAMESPACE}/admin`, adminRouter);

export default router;
