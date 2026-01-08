import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
      <h1 style={{ fontSize: "6rem", margin: 0, color: "#dc3545" }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/">
        <button style={{ padding: "10px 20px", fontSize: "1.2rem", marginTop: "1rem" }}>Go Home</button>
      </Link>
    </div>
  );
}