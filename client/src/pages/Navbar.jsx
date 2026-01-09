import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.JPG" alt="WE_SELL" className="navbar-logo-img" />
          WE_SELL
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
        </div>

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/shop" className="nav-links" onClick={closeMenu}>
              Shop
            </Link>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-links" onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              {user.role === "admin" && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-links" onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </span>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={closeMenu}>
                Login
              </Link>
            </li>
          )}
          
          <li className="nav-item">
            <Link to="/cart" className="nav-links cart-icon" onClick={closeMenu}>
              Cart ({cartItems.length})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}