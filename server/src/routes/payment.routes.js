import express from "express";
import { createStripeSession } from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/stripe/create-session", authMiddleware, createStripeSession);

export default router;
