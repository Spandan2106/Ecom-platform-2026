import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { saveAs } from "file-saver";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import "./Profile.css";

/**
 * Profile component displaying user information and
 * allowing users to update their profile, view
 * order history, manage their wallet, export their
 * data, and delete their account.
 * @returns {JSX.Element} Profile component.
 */
export default function Profile() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user, logout, notify, fetchUser } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [stats, setStats] = useState({ categoryStats: [], monthlyStats: [] });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Fetch Stats
        const statsRes = await axios.get("http://localhost:5000/api/users/stats", config);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 404)) {
          logout(); // Handle user session expiration
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  const confirmDeleteAccount = async () => {
    try {
      if (!user) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete("http://localhost:5000/api/users/profile", config);
      clearCart();
      notify("Account deleted successfully.");
      logout(); // This handles token removal and redirect
    } catch (error) {
      console.error("Error deleting account:", error);
      notify(error.response?.data?.message || "Failed to delete account. Please try again.", "error");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleExportData = async () => {
    try {
      if (!user) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `bearer ${token}` } };
      const { data } = await axios.get("http://localhost:5000/api/users/export", config);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      saveAs(blob, `user_data_backup_${new Date().getTime()}.json`);
      notify("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      notify("Failed to export data. Please try again.", "error");
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!user) return <div className="container"><h2>Please login to view profile</h2></div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Welcome, {user.name}</h1>
        <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>{user.email}</p>
        <div style={{ marginTop: '1.5rem', fontSize: '1.2rem', background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          Wallet Balance: <strong>₹{user.walletBalance?.toFixed(2) || "0.00"}</strong>
        </div>
      </div>

      {/* Charts Section */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <h3 style={{ textAlign: "center" }}>Spending by Category</h3>
          {stats.categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.categoryStats} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: "center" }}>No data available</p>}
        </div>

        <div className="stat-card">
          <h3 style={{ textAlign: "center" }}>Monthly Spending</h3>
          {stats.monthlyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" name="Amount (₹)" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: "center" }}>No data available</p>}
        </div>
      </div>

      <div className="action-buttons-grid">
        <Link to="/update-profile">
          <button className="action-btn" style={{ width: "100%", background: "#007bff" }}>Update Profile</button>
        </Link>

        <Link to="/wallet">
          <button className="action-btn" style={{ width: "100%", background: "#28a745" }}>My Wallet</button>
        </Link>

        <Link to="/history">
          <button className="action-btn" style={{ width: "100%", background: "#6366f1" }}>View Order History</button>
        </Link>
        
        <button 
          onClick={handleExportData} 
          className="action-btn"
          style={{ width: "100%", background: "#64748b" }}
        >
          Export My Data
        </button>

        <button 
          onClick={() => setShowDeleteModal(true)} 
          className="action-btn"
          style={{ background: "#ef4444", width: "100%" }}
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "8px", maxWidth: "400px", textAlign: "center" }}>
            <h3 style={{ color: "#dc3545" }}>Delete Account?</h3>
            <p>Are you sure you want to delete your account? This will permanently remove all your order history, wallet balance, and saved data. This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: "#6c757d" }}>Cancel</button>
              <button onClick={confirmDeleteAccount} style={{ background: "#dc3545" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
