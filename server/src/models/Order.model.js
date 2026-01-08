import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      imageUrl: { type: String },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  status: { type: String, default: "Processing" } 
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);