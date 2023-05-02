import express from "express";
import { userRouter } from "./user.router";
import { adminRouter } from "./admin.router";
import { paymentRouter } from "./payment.router";
import { documentRouter } from "./document.router";

const router = express.Router();
const NAMESPACE = "api";

router.use(`/${NAMESPACE}/user`, userRouter);
router.use(`/${NAMESPACE}/user`, documentRouter);
router.use(`/${NAMESPACE}/admin`, adminRouter);
router.use(`/${NAMESPACE}/payment`, paymentRouter);

export default router;
