import express from 'express';
const router = express.Router();
import {
  deleteUserProfile,
  registerUser,
  updateUserProfile,
  authUser,
  getUserProfile,
  addMoneyToWallet,
  sendMoney,
  deleteSavedCard,
  updateSavedCard,
  payWithWallet,
  payWithSavedCard,
  updateTransactionLimit,
  getUserStats,
  transferCardFunds,
  exportUserData
} from '../controllers/user.controller.js';
// Assuming you have an auth middleware to verify the token
import { protect } from '../middlewares/auth.middleware.js';

// ... other user routes like login, register, etc.

router.post('/register', registerUser);
router.post('/login', authUser);

// Profile Routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

router.get('/stats', protect, getUserStats);
router.get('/export', protect, exportUserData);

// Wallet Routes
router.post('/wallet/add', protect, addMoneyToWallet);
router.post('/wallet/send', protect, sendMoney);
router.post('/wallet/pay', protect, payWithWallet);
router.post('/wallet/pay-card', protect, payWithSavedCard);
router.put('/wallet/limit', protect, updateTransactionLimit);
router.post('/wallet/transfer-card', protect, transferCardFunds);
router.route('/wallet/cards/:id').delete(protect, deleteSavedCard).put(protect, updateSavedCard);

export default router;