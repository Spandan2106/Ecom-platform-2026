import express from "express";
import { createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getUsers, deleteUser } from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

export default router;