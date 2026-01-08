import express from "express";
import { getProducts, getProductById, createProductReview } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", authMiddleware, createProductReview);

export default router;