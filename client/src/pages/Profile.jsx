import React, { useState, useEffect, useRef } from "react";
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
  const [deactivationReason, setDeactivationReason] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const [stats, setStats] = useState({ categoryStats: [], monthlyStats: [] });
  const prevBalance = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUser();
    
    // Real-time polling for updates (every 15 seconds)
    const interval = setInterval(() => {
      fetchUser();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Notification system for balance updates (e.g. successful orders)
  useEffect(() => {
    if (user && prevBalance.current !== null && user.walletBalance !== prevBalance.current) {
      const diff = user.walletBalance - prevBalance.current;
      if (diff !== 0) {
        notify(`Wallet Update: ${diff > 0 ? '+' : ''}₹${diff.toFixed(2)}`, "success");
      }
    }
    if (user) prevBalance.current = user.walletBalance;
  }, [user, notify]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Fetch Stats
        // Add timestamp to prevent caching and ensure real-time data
        const statsRes = await axios.get(`${API_URL}/api/users/stats?t=${Date.now()}`, config);
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

  const confirmDeactivateAccount = async () => {
    try {
      if (!user) return;
      setIsDeactivating(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        data: { reason: deactivationReason }
      };
      await axios.delete(`${API_URL}/api/users/profile`, config);
      clearCart();
      notify("Account deactivated successfully.");
      setTimeout(() => logout(), 1000); // Slight delay to ensure notification is seen
    } catch (error) {
      console.error("Error deactivating account:", error);
      notify(error.response?.data?.message || "Failed to deactivate account.", "error");
    } finally {
      setShowDeleteModal(false);
      setDeactivationReason("");
      setIsDeactivating(false);
    }
  };

  const handleExportData = async () => {
    try {
      if (!user) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/api/users/export`, config);
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
      <div className="profile-header animate-slide-up">
        <div className="profile-avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="wallet-badge">
            <span>Wallet Balance:</span> <strong>₹{user.walletBalance?.toFixed(2) || "0.00"}</strong>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="profile-stats-grid animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="stat-card">
          <h3 className="chart-title">Spending by Category</h3>
          {stats.categoryStats && stats.categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={stats.categoryStats} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value" 
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data available</p>}
        </div>

        <div className="stat-card">
          <h3 className="chart-title">Monthly Spending</h3>
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
          ) : <p className="no-data">No data available</p>}
        </div>
      </div>

      <div className="action-buttons-grid animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Link to="/update-profile">
          <button className="action-btn btn-primary">Update Profile</button>
        </Link>

        <Link to="/wallet">
          <button className="action-btn btn-success">My Wallet</button>
        </Link>

        <Link to="/history">
          <button className="action-btn btn-info">View Order History</button>
        </Link>
        
        <button 
          onClick={handleExportData} 
          className="action-btn btn-secondary"
        >
          Export My Data
        </button>

        <button 
          onClick={() => setShowDeleteModal(true)} 
          className="action-btn btn-danger"
        >
          Deactivate Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title-danger">Deactivate Account?</h3>
            <p>Are you sure you want to deactivate your account? You will be logged out and won't be able to access your data until you reactivate it.</p>
            
            <div className="modal-survey">
              <label htmlFor="deactivation-reason">Please tell us why you are leaving:</label>
              <select 
                id="deactivation-reason"
                className="modal-select"
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
              >
                <option value="">Select a reason (Optional)</option>
                <option value="unused">I don't use this anymore</option>
                <option value="expensive">Too expensive</option>
                <option value="privacy">Privacy concerns</option>
                <option value="alternative">Found a better alternative</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => { setShowDeleteModal(false); setDeactivationReason(""); }} className="modal-btn btn-secondary">Cancel</button>
              <button onClick={confirmDeactivateAccount} disabled={isDeactivating} className="modal-btn btn-danger">{isDeactivating ? "Deactivating..." : "Yes, Deactivate"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
