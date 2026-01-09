import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Checkout.css";

export default function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState({
    address: "", city: "", postalCode: "", country: ""
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const checkoutItems = location.state?.items || cart;
  const total = checkoutItems.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = total - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscount(total * 0.10);
      toast.success("Coupon applied! 10% off.");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code");
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    // Pass address and items to the payment selection page
    // Note: In a real app, you should pass the discount info to the backend to validate again
    navigate("/payment-methods", { state: { items: checkoutItems, address, discount } });
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-grid">
        <div className="shipping-section">
          <h3 className="section-title">Shipping Address</h3>
          <form onSubmit={handleProceed} className="checkout-form">
            <input className="checkout-input" placeholder="Address" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} required />
            <input className="checkout-input" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required />
            <input className="checkout-input" placeholder="Postal Code" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} required />
            <input className="checkout-input" placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} required />
            <button type="submit" className="proceed-btn">Proceed to Payment</button>
          </form>
        </div>

        <div className="summary-section">
          <h3 className="section-title">Order Summary</h3>
          {checkoutItems.map((item, index) => (
            <div key={index} className="summary-item">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <hr className="summary-divider" />
          <div className="coupon-row">
            <input 
              className="coupon-input"
              placeholder="Coupon Code (e.g. SAVE10)" 
              value={coupon} 
              onChange={(e) => setCoupon(e.target.value)} 
            />
            <button type="button" onClick={applyCoupon} className="apply-btn">Apply</button>
          </div>
          {discount > 0 && <p className="discount-text">Discount: -₹{discount.toFixed(2)}</p>}
          <h3 className="total-text">Total: ₹{finalTotal.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}