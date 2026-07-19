import express from "express";
import {
  getUserProfile,
  registerUser,
  authUser,
  updateUserProfile,
  getUserStats,
  exportUserData,
  addMoneyToWallet,
  sendMoney,
  payWithWallet,
  updateTransactionLimit,
  deleteSavedCard,
  updateSavedCard,
  transferCardFunds,
  payWithSavedCard,
} from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile).delete(protect, deleteUser);

router.get("/stats", protect, getUserStats);
router.get("/export", protect, exportUserData);

router.post("/wallet/add", protect, addMoneyToWallet);
router.post("/wallet/send", protect, sendMoney);
router.post("/wallet/pay", protect, payWithWallet);
router.put("/wallet/limit", protect, updateTransactionLimit);
router.delete("/wallet/cards/:cardId", protect, deleteSavedCard);
router.put("/wallet/cards/:cardId", protect, updateSavedCard);
router.post("/wallet/transfer-card", protect, transferCardFunds);
router.post('/wallet/pay-card', protect, payWithSavedCard);

export default router;