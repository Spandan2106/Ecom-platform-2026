import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsCategoryOpen(false);
    navigate("/login");
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setIsCategoryOpen(false);
  };

  const toggleCategoryMenu = () => setIsCategoryOpen(!isCategoryOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeAllMenus}>
          <img src="/logo.JPG" alt="WE_SELL" className="navbar-logo-img" />
          WE_SELL
        </Link>

        <button
          className="menu-icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="nav-menu-list"
        >
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
        </button>

        <ul id="nav-menu-list" className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeAllMenus}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/shop" className="nav-links" onClick={closeAllMenus}>
              Shop
            </Link>
          </li>
          <li className="nav-item nav-item-dropdown">
            <span className="nav-links" onClick={toggleCategoryMenu} style={{ cursor: "pointer" }}>
              Categories
            </span>
            <ul className={`dropdown-menu ${isCategoryOpen ? "show" : ""}`}>
              <li>
                <Link to="/shop?category=Mobiles" className="dropdown-link" onClick={closeAllMenus}>
                  Mobiles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Laptops" className="dropdown-link" onClick={closeAllMenus}>
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Footwear" className="dropdown-link" onClick={closeAllMenus}>
                  Footwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Books" className="dropdown-link" onClick={closeAllMenus}>
                  Books
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home" className="dropdown-link" onClick={closeAllMenus}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Toys" className="dropdown-link" onClick={closeAllMenus}>
                  Toys
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Foods" className="dropdown-link" onClick={closeAllMenus}>
                  Foods
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Cosmetics" className="dropdown-link" onClick={closeAllMenus}>
                  Cosmetics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Stationery" className="dropdown-link" onClick={closeAllMenus}>
                  Stationery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Kids' Fashion" className="dropdown-link" onClick={closeAllMenus}>
                  Kids' Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bags" className="dropdown-link" onClick={closeAllMenus}>
                  Bags
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Sports" className="dropdown-link" onClick={closeAllMenus}>
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Furniture" className="dropdown-link" onClick={closeAllMenus}>
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Pet Supplies" className="dropdown-link" onClick={closeAllMenus}>
                  Pet Supplies
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Men's Fashion" className="dropdown-link" onClick={closeAllMenus}>
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Women's Fashion" className="dropdown-link" onClick={closeAllMenus}>
                  Women's Fashion
                </Link>
              </li>
            </ul>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-links" onClick={closeAllMenus}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/wishlist" className="nav-links" onClick={closeAllMenus}>
                  Wishlist
                </Link>
              </li>
              {user.role === "admin" && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links" onClick={closeAllMenus}>
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button type="button" className="nav-links nav-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={closeAllMenus}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links" onClick={closeAllMenus}>
                  Register
                </Link>
              </li>
            </>
          )}
          
          <li className="nav-item">
            <Link to="/cart" className="nav-links cart-icon" onClick={closeAllMenus}>
              Cart ({cart?.length || 0})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}