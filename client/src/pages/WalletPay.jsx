import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./WalletPay.css";

export default function WalletPay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser, notify, fetchUser } = useAuth();
  const { clearCart } = useCart();
  
  const { items, address, total } = location.state || {};
  const [processing, setProcessing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [paymentError, setPaymentError] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUser();
  }, []);

  if (!items || !total) {
    return <div className="container">Invalid checkout session.</div>;
  }

  const handlePinClick = (num) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) return notify("Please enter 4 digits", "error");
    setShowPinModal(false);
    processPayment();
  };

  const processPayment = async () => {
    setProcessing(true);
    setPaymentError(false);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Fetch fresh user data to get the absolute latest balance
      // This fixes the issue where balance looks sufficient but local state is stale
      const { data: freshUser } = await axios.get(`${API_URL}/api/users/profile`, config);
      
      const payAmount = Number(total);
      
      if ((Number(freshUser.walletBalance) || 0) < payAmount) {
        notify("Insufficient wallet balance", "error");
        setProcessing(false);
        return;
      }

      // 1. Deduct from Wallet
      // This returns the updated user object with new balance and history
      const { data: updatedUser } = await axios.post(
        `${API_URL}/api/users/wallet/pay`,
        { amount: payAmount, description: `Order Payment`, pin: pin },
        config
      );

      // 2. Create Order
      const orderData = {
        orderItems: items.map(item => ({
          name: item.name,
          qty: 1,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: address,
        paymentMethod: "Wallet",
        totalPrice: payAmount,
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
            id: `WALLET_${Date.now()}`,
            status: "COMPLETED",
            update_time: String(Date.now()),
            email_address: user.email
        }
      };

      await axios.post(`${API_URL}/api/orders`, orderData, config);

      // 3. Update Local State immediately so Profile/Wallet pages are fresh
      if (updatedUser) updateUser(updatedUser);
      clearCart();
      
      notify("Payment successful!");
      navigate("/success");

    } catch (error) {
      console.error(error);
      setPaymentError(true);
      notify(error.response?.data?.message || "Payment failed. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="wallet-pay-container">
      <h1 className="wallet-pay-title">Confirm Wallet Payment</h1>
      
      <div className="payment-summary-card">
        <div className="summary-row">
          <span>Current Balance</span>
          <strong>₹{(user?.walletBalance || 0).toFixed(2)}</strong>
        </div>
        <div className="summary-row total">
          <span>Total Amount</span>
          <strong>₹{Number(total).toFixed(2)}</strong>
        </div>
        
        <div className={`balance-status ${(user?.walletBalance || 0) >= Number(total) ? "sufficient" : "insufficient"}`}>
          {(user?.walletBalance || 0) >= Number(total) ? "Sufficient Balance" : "Insufficient Balance"}
        </div>
      </div>

      <button 
        onClick={() => { setPin(""); setShowPinModal(true); }} 
        disabled={processing || (user?.walletBalance || 0) < Number(total)}
        className={`pay-btn ${paymentError ? "retry" : "primary"}`}
      >
        {processing ? "Processing..." : paymentError ? "Retry Payment" : "Pay Now"}
      </button>

      {showPinModal && (
        <div className="pin-modal-overlay">
          <div className="pin-modal-content">
            <h3>Enter Wallet PIN</h3>
            <div className="pin-display">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`}></div>
              ))}
            </div>
            
            <div className="keypad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => handlePinClick(num.toString())} className="keypad-btn">{num}</button>
              ))}
              <button onClick={() => setShowPinModal(false)} className="keypad-btn action-btn cancel">✕</button>
              <button onClick={() => handlePinClick("0")} className="keypad-btn">0</button>
              <button onClick={handleBackspace} className="keypad-btn action-btn backspace">⌫</button>
            </div>

            <button onClick={handlePinSubmit} className="confirm-pin-btn">
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}