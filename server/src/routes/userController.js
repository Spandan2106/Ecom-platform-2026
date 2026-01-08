// This file is deprecated. Logic moved to server/src/controllers/user.controller.js// server/controllers/userController.js

// @desc    Delete user and all associated data (Cascade Delete)
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Delete User Orders
    // Assuming you have an Order model
    await Order.deleteMany({ user: user._id });

    // 2. Delete Wallet History (if stored in a separate collection)
    // If wallet history is embedded in User, it deletes with the user automatically.
    // If it's a separate model:
    // await WalletTransaction.deleteMany({ user: user._id });

    // 3. Delete the User
    // Use deleteOne() or findByIdAndDelete to trigger mongoose middleware if you have any
    await User.deleteOne({ _id: user._id });

    res.json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error deleting account", error: error.message });
  }
};

module.exports = {
    // ... other controllers
    deleteUserProfile
};
