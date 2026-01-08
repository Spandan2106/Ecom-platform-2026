import React from "react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
      <h1 style={{ color: "green" }}>Payment Successful!</h1>
      <p>Thank you for your order. Your transaction has been completed.</p>
      <Link to="/"><button>Continue Shopping</button></Link>
    </div>
  );
}