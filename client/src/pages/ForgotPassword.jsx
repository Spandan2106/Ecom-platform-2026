import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      toast.success(data.message);
      if (data.resetUrl) {
        setResetLink(data.resetUrl);
      }
      setError("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2>Forgot Password</h2>
      {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}
      {resetLink && (
        <div style={{ marginBottom: "15px", padding: "10px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "4px" }}>
          <p style={{ margin: "0 0 5px 0" }}>Development Mode Link:</p>
          <a href={resetLink} style={{ wordBreak: "break-all" }}>{resetLink}</a>
        </div>
      )}
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "white", border: "none" }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
}