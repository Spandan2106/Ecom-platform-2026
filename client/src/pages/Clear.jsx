import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Clear() {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
    const timer = setTimeout(() => {
      navigate("/shop");
    }, 2000);
    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

  return (
    <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
      <h1>Cart Cleared</h1>
      <p>Your cart has been emptied. Redirecting to shop...</p>
    </div>
  );
}