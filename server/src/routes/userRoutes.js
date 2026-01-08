import express from 'express';
import { registerUser, authUser, deleteUserProfile, updateUserProfile, exportUserData, getUserProfile, addMoneyToWallet, sendMoney, deleteSavedCard, updateSavedCard, payWithWallet, updateTransactionLimit, getUserStats, transferCardFunds, payWithSavedCard } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.delete('/profile', protect, deleteUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/export', protect, exportUserData);
router.get('/profile', protect, getUserProfile);
router.get('/stats', protect, getUserStats);
router.post('/wallet/add', protect, addMoneyToWallet);
router.post('/wallet/send', protect, sendMoney);
router.delete('/wallet/cards/:id', protect, deleteSavedCard);
router.put('/wallet/cards/:id', protect, updateSavedCard);
router.post('/wallet/pay', protect, payWithWallet);
router.put('/wallet/limit', protect, updateTransactionLimit);
router.post('/wallet/transfer-card', protect, transferCardFunds);
router.post('/wallet/pay-card', protect, payWithSavedCard);

export default router;