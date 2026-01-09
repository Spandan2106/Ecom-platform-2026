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
      if (user.isActive === false) {
        return res.status(401).json({ message: 'Account is deactivated. Please contact support.' });
      }

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
    if (user.isActive === false) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      walletBalance: user.walletBalance || 0,
      walletHistory: user.walletHistory || [],
      savedCards: user.savedCards || [],
      transactionLimit: user.transactionLimit || 10000,
      walletPin: user.walletPin,
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
      if (user.isActive === false) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.walletPin) {
        user.walletPin = req.body.walletPin;
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
        walletPin: updatedUser.walletPin,
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

    if (user.isActive === false) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Ensure savedCards is initialized to prevent crashes
    if (!user.savedCards) user.savedCards = [];

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    // If using a saved card, add to card balance and deduct from wallet balance
    if (cardId) {
      const card = user.savedCards.id(cardId);
      if (!card) return res.status(404).json({ message: 'Card not found' });
      if ((card.balance || 0) < payAmount) return res.status(400).json({ message: 'Insufficient funds on selected card' });
      card.balance -= payAmount;
      user.walletBalance = (Number(user.walletBalance) || 0) + payAmount;
    } else {
      // Add to wallet balance
      user.walletBalance = (Number(user.walletBalance) || 0) + payAmount;
    }

    // Failsafe: Prevent NaN in database
    if (isNaN(user.walletBalance)) user.walletBalance = 0;

    user.walletHistory = user.walletHistory || [];
    user.walletHistory.push({
      type: 'credit',
      amount: payAmount,
      description: description || 'Added funds',
      date: Date.now(),
      cardId: cardId || null,
    });

    if (saveCard && cardDetails && cardDetails.number) {
      user.savedCards = user.savedCards || [];
      user.savedCards.push({
        name: user.name || 'Card Holder',
        brand: 'Visa', // Mock brand detection
        last4: cardDetails.number.slice(-4),
        expiry: cardDetails.expiry,
        balance: 50000 // Mock balance
      });
      user.markModified('savedCards');
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
      user.savedCards.pull(req.params.id);
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
    const { amount, description, pin } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.walletPin && user.walletPin !== pin) {
      return res.status(400).json({ message: 'Invalid Wallet PIN' });
    }

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    if ((Number(user.walletBalance) || 0) < payAmount) return res.status(400).json({ message: 'Insufficient balance' });

    user.walletBalance = (Number(user.walletBalance) || 0) - payAmount;
    if (isNaN(user.walletBalance)) user.walletBalance = 0; // Failsafe

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
    const orders = await Order.find({ user: userId, isPaid: true }).sort({ createdAt: -1 }).populate('orderItems.product');

    // Category stats: group by product category
    const categoryMap = {};
    const monthlyMap = {};

    orders.forEach(order => {
      // Monthly stats
      const date = new Date(order.createdAt);
      const month = !isNaN(date) ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Unknown';
      monthlyMap[month] = (monthlyMap[month] || 0) + (Number(order.totalPrice) || 0);

      // Category stats
      order.orderItems.forEach(item => {
        const category = item.product?.category || 'Other';
        const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);
        categoryMap[category] = (categoryMap[category] || 0) + itemTotal;
      });
    });

    const categoryStats = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value: Number(value) || 0 }))
      .filter(stat => stat.value > 0);
      
    const monthlyStats = Object.entries(monthlyMap).map(([name, amount]) => ({ name, amount: Number(amount) || 0 }));

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

    // Soft delete: Deactivate instead of removing
    user.isActive = false;
    
    if (req.body.reason) {
      user.deactivationReason = req.body.reason;
    }

    await user.save();

    res.json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error deactivating account" });
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
  walletPin: user.walletPin,
});