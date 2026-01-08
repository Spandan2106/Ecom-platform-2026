import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
        <h2>Please Login to view your Cart</h2>
        <Link to="/login"><button>Login</button></Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <div>
          {cart.map((item) => (
            <div key={item.cartItemId} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p style={{ margin: '0.25rem 0 0 0' }}>₹{item.price}</p>
              </div>
              <div>
                <button onClick={() => navigate("/checkout", { state: { items: [item] } })} style={{ background: '#28a745', marginRight: '10px' }}>Buy Now</button>
                <button onClick={() => {
                  removeFromCart(item.cartItemId);
                  toast.success("Item removed");
                }} style={{background: '#ef4444'}}>Remove</button>
              </div>
            </div>
          ))}
          <hr />
          <h2 style={{textAlign: 'right'}}>Total: ₹{total}</h2>
          <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}