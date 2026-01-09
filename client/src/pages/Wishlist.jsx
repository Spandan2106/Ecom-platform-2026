import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  const API_URL = (import.meta.env.VITE_API_URL || "https://ecom-api-paxi.onrender.com").replace(/\/$/, "");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${API_URL}/api/auth/wishlist`, config);
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`${API_URL}/api/auth/wishlist`, { productId }, config);
      setWishlist(data);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please logout and login again.");
      } else {
        toast.error(error.response?.data?.message || "Error removing from wishlist");
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/shop">Go Shopping</Link></p>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            product && (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                  <h3>{product.name}</h3>
                </Link>
                <p>₹{product.price}</p>
                <button onClick={() => {
                  addToCart(product);
                  toast.success("Added to cart");
                }}>Add to Cart</button>
                <button 
                  onClick={() => removeFromWishlist(product._id)} 
                  style={{ backgroundColor: "#ef4444", marginTop: "10px", marginLeft: "10px" }}
                >
                  Remove
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}