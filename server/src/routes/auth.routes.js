import express from "express";
import { register, login, forgotPassword, resetPassword, toggleWishlist, getWishlist, syncCart, getCart, removeCartItem, clearCart, clearWishlist, deleteUser, getUserProfile, updateUserProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.put("/wishlist", authMiddleware, toggleWishlist);
router.get("/wishlist", authMiddleware, getWishlist);
router.delete("/wishlist", authMiddleware, clearWishlist);
router.put("/cart", authMiddleware, syncCart);
router.get("/cart", authMiddleware, getCart);
router.delete("/cart", authMiddleware, clearCart);
router.delete("/cart/:id", authMiddleware, removeCartItem);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUser);
export default router;
