import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    <div className="container">
      <h1>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="form-container" style={{ margin: 0, maxWidth: "100%" }}>
          <h3>Shipping Address</h3>
          <form onSubmit={handleProceed}>
            <input placeholder="Address" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} required />
            <input placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required />
            <input placeholder="Postal Code" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} required />
            <input placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} required />
            <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>Proceed to Payment</button>
          </form>
        </div>

        <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", height: "fit-content" }}>
          <h3>Order Summary</h3>
          {checkoutItems.map((item, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <hr />
          <div style={{ marginBottom: "1rem", display: "flex", gap: "10px" }}>
            <input 
              placeholder="Coupon Code" 
              value={coupon} 
              onChange={(e) => setCoupon(e.target.value)} 
              style={{ padding: "8px", flex: 1 }}
            />
            <button type="button" onClick={applyCoupon} style={{ padding: "8px 15px", background: "#007bff" }}>Apply</button>
          </div>
          {discount > 0 && <p style={{ textAlign: "right", color: "green" }}>Discount: -₹{discount.toFixed(2)}</p>}
          <h3 style={{ textAlign: "right" }}>Total: ₹{finalTotal.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}