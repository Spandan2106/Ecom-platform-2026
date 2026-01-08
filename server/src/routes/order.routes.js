import express from "express";
import { createOrder, getMyOrders, cancelOrder, getOrderById, updateOrderToPaid, deleteOrder } from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/:id/cancel", authMiddleware, cancelOrder);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/pay", authMiddleware, updateOrderToPaid);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;