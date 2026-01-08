import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function WalletPay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser, notify, fetchUser } = useAuth();
  const { clearCart } = useCart();
  
  const { items, address, total } = location.state || {};
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  if (!items || !total) {
    return <div className="container">Invalid checkout session.</div>;
  }

  const handleConfirmPayment = async () => {
    // 1. Force refresh user data to get the absolute latest balance
    // This fixes the issue where balance looks sufficient but code thinks it's 0
    await fetchUser();
    
    const payAmount = Number(total);
    // Use the user from context, which should now be updated, but fallback safely
    if ((user?.walletBalance || 0) < payAmount) {
      notify("Insufficient wallet balance", "error");
      return;
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Deduct from Wallet
      // This returns the updated user object with new balance and history
      const { data: updatedUser } = await axios.post(
        "http://localhost:5000/api/users/wallet/pay",
        { amount: payAmount, description: `Order Payment` },
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

      await axios.post("http://localhost:5000/api/orders", orderData, config);

      // 3. Update Local State immediately so Profile/Wallet pages are fresh
      updateUser(updatedUser);
      clearCart();
      
      notify("Payment successful!");
      navigate("/success");

    } catch (error) {
      console.error(error);
      notify(error.response?.data?.message || "Payment failed. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "2rem", textAlign: "center" }}>
      <h1>Confirm Wallet Payment</h1>
      <div style={{ margin: "2rem 0", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <p>Total Amount: <strong>₹{Number(total).toFixed(2)}</strong></p>
        <p>Current Balance: <strong>₹{(user?.walletBalance || 0).toFixed(2)}</strong></p>
        <p style={{ color: (user?.walletBalance || 0) >= Number(total) ? "green" : "red" }}>
          {(user?.walletBalance || 0) >= Number(total) ? "Sufficient Balance" : "Insufficient Balance"}
        </p>
      </div>
      <button 
        onClick={handleConfirmPayment} 
        disabled={processing || (user?.walletBalance || 0) < Number(total)}
        style={{ 
          padding: "10px 20px", 
          background: (user?.walletBalance || 0) >= Number(total) ? "#28a745" : "#ccc", 
          color: "white", 
          border: "none", 
          borderRadius: "5px", 
          cursor: (user?.walletBalance || 0) >= Number(total) ? "pointer" : "not-allowed"
        }}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}