import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser, notify } = useAuth();

  const API_URL = (import.meta.env.VITE_API_URL || "https://ecom-api-paxi.onrender.com").replace(/\/$/, "");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password.length < 6) {
      notify("Password must be at least 6 characters", "error");
      return;
    }
    if (password && password !== confirmPassword) {
      notify("Passwords do not match", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, email, password },
        config
      );
      
      updateUser(data); // Update global state correctly
      notify("Profile updated successfully");
      setError("");
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      notify(err.response?.data?.message || "Update failed", "error");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "2rem" }}>
      <h1>Update Profile</h1>
      {message && <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>}
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        </div>
        <hr />
        <h3>Change Password</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current" style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" style={{ width: "100%", padding: "8px" }} />
        </div>
        <button type="submit" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none" }}>Update</button>
      </form>
    </div>
  );
}