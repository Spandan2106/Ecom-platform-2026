import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  // This gets the current page URL to share
  const shareUrl = window.location.href;


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch current product
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data); // Product data now includes reviews from backend if populated, but we are sending them separately in controller
        setReviews(res.data.reviews || []);
        
        // Fetch related products based on category
        if (res.data.category) {
          const relatedRes = await axios.get(`${API_URL}/api/products?category=${res.data.category}`);
          // Filter out the current product and limit to 4 items
          const related = relatedRes.data.filter(p => p._id !== id).slice(0, 4);
          setRelatedProducts(related);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); // Scroll to top when switching products
  }, [id]);

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to add to wishlist");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/api/auth/wishlist`, { productId: product._id }, config);
      alert("Wishlist updated!");
    } catch (error) {
      alert("Error updating wishlist");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to review");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${API_URL}/api/products/${id}/reviews`, { rating, comment }, config);
      setReviews([...reviews, data]);
      setComment("");
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;
  if (!product) return <div className="container"><h2>Product not found</h2></div>;

  return (
    <div className="container">
      <div className="product-details-wrapper">
        <div className="details-image">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/400"} 
            alt={product.name} 
          />
        </div>
        <div className="details-info">
          <h1>{product.name}</h1>
          <p className="details-category">Category: <span>{product.category}</span></p>
          <p className="details-price">₹{product.price}</p>
          <p className="details-desc">{product.description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
            <button onClick={handleAddToWishlist} style={{ background: '#ec4899' }}>Add to Wishlist</button>
            <span className={`stock-badge ${product.stock > 0 ? '' : 'out'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h4 style={{ marginBottom: "0.5rem" }}>Share this product:</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          <FacebookShareButton url={shareUrl} quote={product?.name}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={product?.name}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={product?.name} separator=":: ">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>

      <div className="reviews-section" style={{ marginBottom: '4rem' }}>
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        <div style={{ marginBottom: '2rem' }}>
          {reviews.map((review, index) => (
            <div key={index} style={{ background: '#f8fafc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <strong>{review.name}</strong> <span style={{ color: '#fbbf24' }}>{'★'.repeat(review.rating)}</span>
              <p style={{ margin: '0.5rem 0' }}>{review.comment}</p>
              <small style={{ color: '#64748b' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>

        <div className="form-container" style={{ margin: '0', maxWidth: '100%', textAlign: 'left' }}>
          <h3>Write a Review</h3>
          <form onSubmit={submitReview}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Rating: </label>
              <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '0.5rem' }}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <textarea placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} required style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}></textarea>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="product-grid">
{relatedProducts.map(p => (
  <div key={p._id}>
    <div className="product-card">
      <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="product-image" />}
        <h3>{p.name}</h3>
      </Link>
      <p className="product-desc">{p.description.substring(0, 50)}...</p>
      <p>₹{p.price}</p>
      <button onClick={() => addToCart(p)}>Add to Cart</button>
    </div>
  </div>
))}
          </div>
        </div>
      )}
    </div>
  );
}