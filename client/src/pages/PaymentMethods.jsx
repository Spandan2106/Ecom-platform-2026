import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function PaymentMethods() {
  const location = useLocation();
  const navigate = useNavigate();
  const { removeFromCart } = useCart();
  const { user, notify } = useAuth();
  
  const { items, address, discount } = location.state || {};
  const subtotal = items ? items.reduce((sum, item) => sum + item.price, 0) : 0;
  const total = subtotal - (discount || 0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  if (!items) {
    return <div className="container">No items to checkout.</div>;
  }

  const handleStripePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return notify("Please login to checkout", "error");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Create Order in DB
      const orderData = {
        orderItems: items.map(item => ({
          name: item.name,
          qty: 1,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: address,
        paymentMethod: "Stripe",
        totalPrice: Number(total)
      };

      await axios.post(`${API_URL}/api/orders`, orderData, config);

      // 2. Create Stripe Session
      const { data } = await axios.post(
        `${API_URL}/api/payment/stripe/create-session`,
        { cartItems: items, userId: user?._id },
        config
      );

      // Remove purchased items from local cart
      items.forEach(item => removeFromCart(item.cartItemId));

      // 3. Redirect to Stripe
      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Connection error. Please try again.";
      notify(errorMessage, "error");
    }
  };

  const handleWalletPayment = () => {
    navigate("/wallet-pay", { state: { items, address, total } });
  };

  const handleOtherPayment = (method) => {
    notify(`${method} is currently in simulation mode. Please use "We Sell Pay Balance" for testing.`, 'info');
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    margin: "10px 0",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
    textAlign: "left",
    background: "white",
    color: "black",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <h1>Select Payment Method</h1>
      <p>Total Amount: <strong>₹{total}</strong></p>
      
      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleStripePayment} style={{ ...buttonStyle, borderLeft: "5px solid #635bff" }}>
          <span>Stripe (Credit/Debit Card)</span> <span>💳</span>
        </button>
        
        <button onClick={handleWalletPayment} style={{ ...buttonStyle, borderLeft: "5px solid #28a745", background: "#f0fff4" }}>
          <span>We Sell Pay Balance (Simulated Wallet)</span> <span>💰 ₹{user?.walletBalance?.toFixed(2) || "0.00"}</span>
        </button>

        <button onClick={() => handleOtherPayment("Paytm")} style={buttonStyle}>
          <span>Paytm</span> <span>📱</span>
        </button>
        <button onClick={() => handleOtherPayment("PhonePe")} style={buttonStyle}>
          <span>PhonePe</span> <span>🟣</span>
        </button>
        <button onClick={() => handleOtherPayment("UPI")} style={buttonStyle}>
          <span>UPI</span> <span>⚡</span>
        </button>
        <button onClick={() => handleOtherPayment("Google Pay")} style={buttonStyle}>
          <span>Google Pay</span> <span>🇬</span>
        </button>
      </div>

      {/* Wallet History Preview */}
      <div style={{ marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
        <h3>Recent Wallet Transactions</h3>
        {user?.walletHistory?.length > 0 ? (
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {[...user.walletHistory].reverse().slice(0, 5).map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>{t.description}</div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div style={{ color: t.type === 'credit' ? 'green' : 'red', fontWeight: "bold" }}>
                  {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666" }}>No recent transactions.</p>
        )}
      </div>
    </div>
  );
}