import React from "react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
      <h1 style={{ color: "red" }}>Payment Cancelled</h1>
      <p>You have cancelled the payment process.</p>
      <Link to="/cart"><button>Return to Cart</button></Link>
    </div>
  );
}