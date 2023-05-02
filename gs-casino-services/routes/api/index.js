import express from "express";
import { userRouter } from "./user.router";
import { swissSoftRouter } from "./swissSoft.router";

const router = express.Router();
const NAMESPACE = "api";

router.use(`/${NAMESPACE}/swissSoft`, swissSoftRouter);
router.use(`/${NAMESPACE}/user`, userRouter);

export default router;
