import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    qty: Number,
    price: Number,
    imageUrl: String
  }],
  walletBalance: { type: Number, default: 0 },
  walletHistory: [{
    amount: Number,
    type: { type: String, enum: ['credit', 'debit'] },
    description: String,
    date: { type: Date, default: Date.now },
    cardId: { type: mongoose.Schema.Types.ObjectId }
  }],
  savedCards: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    brand: String,
    last4: String,
    token: String,
    expiry: String,
    balance: { type: Number, default: 50000 } // Mock balance for simulation
  }],
  transactionLimit: { type: Number, default: 10000 }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);