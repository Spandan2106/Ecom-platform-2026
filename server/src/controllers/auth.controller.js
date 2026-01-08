import User from "../models/User.model.js";
import Order from "../models/Order.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You have requested a password reset. Please go to this link to reset your password:\n\n${resetUrl}`;

    console.log(`[DEV] Password Reset Link: ${resetUrl}`);

    try {
      await sendEmail({ email: user.email, subject: "Password Reset Request", message });
      res.json({ message: "Email sent" });
    } catch (err) {
      console.error("Email sending failed:", err);
      // Don't clear token so dev can use the link from console
      res.json({ message: "Email sending failed (Dev Mode)", resetUrl });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const targetId = String(productId);
    
    if (!user.wishlist) user.wishlist = [];
    // Filter out any nulls or invalid entries first to prevent crashes
    user.wishlist = user.wishlist.filter(id => id);

    // Check existence using string comparison
    const index = user.wishlist.findIndex((id) => id.toString() === targetId);
    if (index !== -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(targetId);
    }
    await user.save();
    await user.populate("wishlist");
    
    // Clean up any nulls (deleted products) from the database permanently
    const originalLength = user.wishlist.length;
    const validWishlist = user.wishlist.filter(item => item !== null);
    
    if (validWishlist.length !== originalLength) {
      user.wishlist = validWishlist.map(item => item._id); // Save only IDs
      await user.save();
      // Return the valid populated list we already have to prevent errors
      return res.json(validWishlist);
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;

    // Safely filter out the item, checking if product exists to prevent crashes
    user.cart = user.cart.filter((item) => {
      if (!item.product) return true; // Keep items with broken references
      return item.product.toString() !== productId;
    });

    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const syncCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const cartItems = req.body.cartItems;

    // Prevent accidental cart wipe on refresh if frontend sends empty array
    if (!cartItems || cartItems.length === 0) {
      return res.json(user.cart);
    }

    console.log(`[Cart] Syncing ${cartItems.length} items for user ${req.user._id}`);

    // Merge logic: Update existing items or add new ones (prevents vanishing on refresh)
    for (const item of cartItems) {
        let productId = item.product;
        if (typeof productId === 'object' && productId !== null) {
            productId = productId._id || productId.id || null;
        }
        
        if (!productId) continue;

        const existingItem = user.cart.find(cartItem => 
            cartItem.product && cartItem.product.toString() === productId.toString()
        );

        if (existingItem) {
            existingItem.qty = item.qty;
        } else {
            user.cart.push({
                product: productId,
                name: item.name,
                qty: item.qty,
                price: item.price,
                imageUrl: item.imageUrl || item.image
            });
        }
    }
      
    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    
    // Auto-clean: Remove items where the product no longer exists
    const originalLength = user.cart.length;
    const validCart = user.cart.filter(item => item.product !== null);
    
    if (validCart.length !== originalLength) {
      // Map back to simple structure to ensure clean save
      user.cart = validCart.map(item => ({
        ...item.toObject(),
        product: item.product._id
      }));
      await user.save();
      await user.populate("cart.product"); // Re-populate for response
    }
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    
    // Auto-clean: Remove nulls permanently
    const originalLength = user.wishlist.length;
    const validWishlist = user.wishlist.filter(item => item !== null);
    
    if (validWishlist.length !== originalLength) {
      user.wishlist = validWishlist.map(item => item._id);
      await user.save();
      await user.populate("wishlist");
    }
    
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log(`[Auth] Deleting user account: ${req.user._id}`);
    await Order.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "User account and all associated data deleted successfully" });
  } catch (error) {
    console.error("[Auth] Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};
// server/src/controllers/auth.controller.js

// ... existing imports and functions (login, register, etc.)

export const updateWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // Ensure your authMiddleware sets req.user

  try {
    // Assuming you have a User model imported
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is already in wishlist
    // Ensure productId is treated as a string or ObjectId for comparison
    const index = user.wishlist.indexOf(productId);
    
    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      await user.save();
      res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
    }
  } catch (error) {
    console.error("Wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
