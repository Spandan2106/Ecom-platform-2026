import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "../App.css";
import "./Home.css";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = Array.isArray(res.data) ? res.data : [];
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: "Electronics", img: "https://t4.ftcdn.net/jpg/03/64/41/07/360_F_364410756_Ev3WoDfNyxO9c9n4tYIsU5YBQWAP3UF8.jpg" },
    { name: "Fashion", img: "https://fashionista.com/.image/t_share/MTYxNDYwODAyNzMyMTcyNjMx/paris-fashion-week-mens-street-style-fall-2019.jpg" },
    { name: "Home & Living", img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80" },
    { name: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80" },
    { name: "Books", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80" },
    { name: "Toys", img: "https://img.freepik.com/premium-photo/toys-collection-teddy-bear-wooden-desk-room_488220-2154.jpg?semt=ais_hybrid&w=740&q=80" },
    { name: "Beauty", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80" },
    { name: "Automotive", img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80" }
  ];

  const testimonials = [
    { name: "John Doe", text: "Amazing service! The products are top notch and delivery was super fast.", role: "Verified Buyer" },
    { name: "Jane Smith", text: "I love the variety of items available. Will definitely shop here again.", role: "Fashion Enthusiast" },
    { name: "Mike Johnson", text: "Customer support was very helpful when I had a question about my order.", role: "Tech Geek" },
    { name: "Emily Davis", text: "Great prices and quality products. Highly recommend WE_SELL.com!", role: "Home Decor Lover" },
    { name: "David Wilson", text: "The shopping experience was seamless and enjoyable. Five stars!", role: "Sports Fanatic" },
    {
      name: "Sophia Brown",
      text: "I was impressed by the user-friendly website and the secure payment options.",
      role: "Frequent Shopper"
    },
    { name: "Liam Miller",
      text: "The recently viewed products feature helped me find what I was looking for quickly.",
      role: "Bargain Hunter"
    },
    { name: "Olivia Garcia",
      text: "I appreciate the eco-friendly packaging and the company's commitment to sustainability.",
      role: "Eco-Conscious Consumer"
    },
    {
      name: "Noah Martinez",
      text: "The detailed product descriptions and reviews made my purchasing decision easy.",
      role: "Informed Buyer"
    },
    {
      name: "Ava Rodriguez",
      text: "I had a fantastic experience using the mobile app. Shopping on the go has never been easier!",
      role: "Mobile Shopper"
    },
    {
      name: "William Hernandez",
      text: "The loyalty program rewards are a great incentive to keep shopping here.",
      role: "Loyal Customer"
    },
    {
      name: "Isabella Lopez",
      text: "Fast shipping and excellent packaging. My order arrived in perfect condition.",
      role: "Satisfied Customer"
    },
    {
      name: "James Gonzalez",
      text: "The live chat support was quick and resolved my issue efficiently.",
      role: "Happy Shopper"
    },
    {
      name: "Mia Wilson",
      text: "I found unique products that I couldn't find anywhere else. Love this site!",
      role: "Unique Finds Seeker"
    },
    {
      name: "Benjamin Anderson",
      text: "The checkout process was smooth and hassle-free. Will shop here again!",
      role: "Repeat Customer"
    },
    {
      name: "Charlotte Thomas",
      text: "I appreciate the detailed size guides which helped me choose the right fit.",
      role: "Clothing Shopper"
    },
    {
      name: "Elijah Taylor",
      text: "The variety of payment options made it convenient for me to complete my purchase.",
      role: "Convenience Seeker"
    },
    {
      name: "Amelia Moore",
      text: "The customer reviews were very helpful in making my buying decision.",
      role: "Review Reader"
    }
  ];

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section animate-slide-up">
        <h1>Welcome to WE_SELL.com</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "var(--text-dark)" }}>
          Your one-stop destination for everything you need.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/shop">
            <button className="hero-btn">Shop Now</button>
          </Link>
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card hover-scale">
              <img src={cat.img} alt={cat.name} />
              <div className="category-overlay">
                <h3>{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", margin: "4rem 0" }}>Loading featured products...</p>
      ) : error ? (
        <p style={{ textAlign: "center", margin: "4rem 0", color: "red" }}>{error}</p>
      ) : featuredProducts.length > 0 ? (
        <div style={{ margin: "4rem 0" }} className="animate-slide-up">
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.map(p => (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="product-image" />}
                  <h3>{p.name}</h3>
                </Link>
                <p className="product-desc">{p.description.substring(0, 50)}...</p>
                <p>₹{p.price}</p>
                <button onClick={() => addToCart(p)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", margin: "4rem 0" }}>No featured products found. Please run the seed script.</p>
      )}

      <div className="testimonials-section animate-slide-up">
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>What Our Customers Say</h2>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ fontSize: "2rem", color: "var(--primary)", marginBottom: "0.5rem" }}>"</div>
                <p style={{ fontStyle: "italic", marginBottom: "1rem", color: "var(--text-light)", flex: 1 }}>{t.text}</p>
                <h4 style={{ marginBottom: "0.2rem", fontWeight: "bold" }}>{t.name}</h4>
                <span style={{ fontSize: "0.8rem", color: "var(--secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="info-grid animate-slide-up">
        <div className="info-card">
          <h3>About Us</h3>
          <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>Learn more about our story and mission.</p>
          <Link to="/about"><button className="info-btn">Go to About</button></Link>
        </div>
        <div className="info-card">
          <h3>Contact Us</h3>
          <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>Get in touch with our support team.</p>
          <Link to="/contact"><button className="info-btn">Contact Support</button></Link>
        </div>
        <div className="info-card">
          <h3>Join Us</h3>
          <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>New here? Create an account today.</p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <Link to="/login"><button className="info-btn">Login</button></Link>
            <Link to="/register"><button className="info-btn" style={{ background: "var(--secondary)" }}>Register</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
