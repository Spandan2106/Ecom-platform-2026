import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: expiresIn || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches (assuming matchPassword method on model, or fallback to bcrypt)
    if (user && (await user.matchPassword(password))) {
      const expiresIn = rememberMe ? '30d' : '24h';
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token: generateToken(user._id, expiresIn),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      walletBalance: user.walletBalance || 0,
      walletHistory: user.walletHistory || [],
      savedCards: user.savedCards || [],
      transactionLimit: user.transactionLimit || 10000,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        walletBalance: updatedUser.walletBalance,
        walletHistory: updatedUser.walletHistory,
        savedCards: updatedUser.savedCards,
        transactionLimit: updatedUser.transactionLimit,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add money to wallet
// @route   POST /api/users/wallet/add
// @access  Private
export const addMoneyToWallet = async (req, res) => {
  try {
    const { amount, description, cardDetails, saveCard, cardId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const payAmount = Number(amount);

    // If using a saved card, add to card balance and deduct from wallet balance
    if (cardId) {
      const card = user.savedCards.id(cardId);
      if (!card) return res.status(404).json({ message: 'Card not found' });
      if (user.walletBalance < payAmount) return res.status(400).json({ message: 'Insufficient wallet balance' });
      card.balance = (card.balance || 0) + payAmount;
      user.walletBalance -= payAmount;
    } else {
      // Add to wallet balance
      user.walletBalance = (user.walletBalance || 0) + payAmount;
    }

    user.walletHistory = user.walletHistory || [];
    user.walletHistory.push({
      type: 'credit',
      amount: payAmount,
      description: description || 'Added funds',
      date: Date.now(),
      cardId: cardId || null,
    });

    if (saveCard && cardDetails) {
      user.savedCards = user.savedCards || [];
      user.savedCards.push({
        brand: 'Visa', // Mock brand detection
        last4: cardDetails.number.slice(-4),
        expiry: cardDetails.expiry,
        balance: 50000 // Mock balance
      });
    }

    await user.save();

    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMoney = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const sender = await User.findById(req.user._id);
    const recipient = await User.findOne({ email });

    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    if ((sender.walletBalance || 0) < amount) return res.status(400).json({ message: 'Insufficient funds' });

    sender.walletBalance -= Number(amount);
    sender.walletHistory.push({ type: 'debit', amount: Number(amount), description: `Sent to ${email}`, date: Date.now() });

    recipient.walletBalance = (recipient.walletBalance || 0) + Number(amount);
    recipient.walletHistory.push({ type: 'credit', amount: Number(amount), description: `Received from ${sender.email}`, date: Date.now() });

    await sender.save();
    await recipient.save();

    res.json(formatUserResponse(sender));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavedCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.savedCards) {
      const cardToDelete = user.savedCards.find(card => card._id.toString() === req.params.id);
      if (cardToDelete) {
        // Subtract the card's balance from wallet balance
        user.walletBalance = (user.walletBalance || 0) - (cardToDelete.balance || 0);
        // Add to wallet history
        user.walletHistory = user.walletHistory || [];
        user.walletHistory.push({
          type: 'debit',
          amount: cardToDelete.balance || 0,
          description: `Card removed: ${cardToDelete.brand} **${cardToDelete.last4}`,
          date: Date.now(),
        });
      }
      user.savedCards = user.savedCards.filter(card => card._id.toString() !== req.params.id);
      await user.save();
    }
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSavedCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const card = user.savedCards.id(req.params.id);
    if (card) {
      card.expiry = req.body.expiry || card.expiry;
      await user.save();
      res.json(formatUserResponse(user));
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payWithWallet = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = await User.findById(req.user._id);
    const payAmount = Number(amount);
    if ((user.walletBalance || 0) < payAmount) return res.status(400).json({ message: 'Insufficient balance' });

    user.walletBalance -= payAmount;
    user.walletHistory.push({ type: 'debit', amount: payAmount, description: description || 'Payment', date: Date.now() });
    await user.save();
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payWithSavedCard = async (req, res) => {
  try {
    const { cardId, amount } = req.body;
    const user = await User.findById(req.user._id);
    const card = user.savedCards.id(cardId);

    if (!card) return res.status(404).json({ message: "Card not found" });
    if (card.balance < amount) return res.status(400).json({ message: "Insufficient funds on card" });

    card.balance -= Number(amount);
    // Optionally record a transaction in walletHistory if desired, 
    // but usually card payments are external.
    
    await user.save();
    // Return full user to update frontend state
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransactionLimit = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.transactionLimit = req.body.limit;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's orders with populated products
    const orders = await Order.find({ user: userId, isPaid: true }).populate('orderItems.product');

    // Category stats: group by product category
    const categoryMap = {};
    const monthlyMap = {};

    orders.forEach(order => {
      // Monthly stats
      const month = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyMap[month] = (monthlyMap[month] || 0) + order.totalPrice;

      // Category stats
      order.orderItems.forEach(item => {
        const category = item.product?.category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + (item.price * item.qty);
      });
    });

    const categoryStats = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    const monthlyStats = Object.entries(monthlyMap).map(([name, amount]) => ({ name, amount }));

    res.json({ categoryStats, monthlyStats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

export const transferCardFunds = async (req, res) => {
  try {
    const { sourceCardId, destCardId, amount } = req.body;
    const user = await User.findById(req.user._id);

    const sourceCard = user.savedCards.id(sourceCardId);
    const destCard = user.savedCards.id(destCardId);

    if (!sourceCard || !destCard) return res.status(404).json({ message: "Card not found" });
    if (sourceCard.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    sourceCard.balance -= Number(amount);
    destCard.balance += Number(amount);

    await user.save();
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportUserData = async (req, res) => { const user = await User.findById(req.user._id).select('-password'); res.json(user); };

// @desc    Delete user and all associated data (Cascade Delete)
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Delete User Orders (Cascade Delete)
    // This ensures history is removed when the account is deleted
    try {
      if (Order) {
        await Order.deleteMany({ user: user._id });
      }
    } catch (err) {
      console.error("Error deleting user orders:", err);
    }

    // 2. Delete the User
    await User.deleteOne({ _id: user._id });

    res.json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error deleting account. Please try again." });
  }
};

// Helper to ensure consistent response structure
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  walletBalance: user.walletBalance,
  walletHistory: user.walletHistory,
  savedCards: user.savedCards,
  transactionLimit: user.transactionLimit,
});