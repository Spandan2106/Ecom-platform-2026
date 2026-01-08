import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage to prevent flicker/logout on refresh
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Add timestamp to prevent caching
      const { data } = await axios.get(`http://localhost:5000/api/users/profile?t=${new Date().getTime()}`, config);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user:", error);
      // Only logout if the token is invalid (401 Unauthorized)
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const notify = (message, type = 'success') => {
    if (type === 'error') toast.error(message);
    else if (type === 'info') toast(message, { 
      icon: 'ℹ️',
      style: { borderLeft: '4px solid #3b82f6' }
    });
    else toast.success(message);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, fetchUser, notify }}>
      {children}
    </AuthContext.Provider>
  );
};