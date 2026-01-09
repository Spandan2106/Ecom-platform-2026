import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Shop.css";
import toast from "react-hot-toast";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);

  // State for Pagination and Quick View
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 12;
  
  const { addToCart } = useCart();

  const API_URL = (import.meta.env.VITE_API_URL || "https://ecom-api-paxi.onrender.com").replace(/\/$/, "");

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const filterProducts = useCallback(() => {
    let temp = [...products];

    if (selectedCategory !== "All") {
      temp = temp.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      temp = temp.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    temp = temp.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Sorting
    if (sortBy === "lowToHigh") {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      temp.sort((a, b) => b.price - a.price);
    }
    // Default or "newest" uses original order (assuming API returns newest first or we can sort by _id)

    setFilteredProducts(temp);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  useEffect(() => {
    filterProducts();
    setCurrentPage(1); // Reset to first page on any filter change
  }, [filterProducts]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    closeQuickView(); // Close modal on add to cart
  }, [addToCart, closeQuickView]);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
  }, []);

  // Memoized calculation for paginated products
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <div className="shop-container"><h2>Loading Shop...</h2></div>;

  return (
    <div className="shop-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ width: '100%', marginBottom: '1rem', display: 'block' }}>
        <button onClick={() => setShowFilters(!showFilters)} style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {showFilters ? "Hide Filters" : "Show Filters ⇩"}
        </button>
      </div>

      {/* Sidebar */}
      {showFilters && (
      <aside className="shop-sidebar">
        <div className="filter-group">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map(cat => (
              <li 
                key={cat} 
                className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                {selectedCategory === cat && <span>•</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="filter-group">
          <h3>Price Range</h3>
          <div className="price-inputs">
            <input 
              type="number" 
              placeholder="Min" 
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
            />
          </div>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <main className="shop-content" style={{ flex: 1, minWidth: '300px' }}>
        <div className="shop-header">
          <h2>Shop All Products ({filteredProducts.length})</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="newest">Newest</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {currentProducts.map(product => (
            <div key={product._id} className="shop-product-card">
              <Link to={`/product/${product._id}`} className="product-img-wrapper">
                <img src={product.imageUrl || "https://via.placeholder.com/300"} alt={product.name} />
                <button className="quick-view-btn" onClick={(e) => { e.preventDefault(); openQuickView(product); }}>Quick View</button>
              </Link>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link to={`/product/${product._id}`} style={{textDecoration: 'none'}}><h3 className="product-title">{product.name}</h3></Link>
                <div className="product-price">₹{product.price}</div>
                <button className="add-btn" onClick={() => handleAddToCart(product)}>+ Add to Cart</button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <p>No products found matching your criteria.</p>}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              &laquo; Prev
            </button>
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => setCurrentPage(number + 1)}
                className={currentPage === number + 1 ? 'active' : ''}
              >
                {number + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              Next &raquo;
            </button>
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="quick-view-close" onClick={closeQuickView}>&times;</button>
            <div className="quick-view-image">
              <img src={quickViewProduct.imageUrl || "https://via.placeholder.com/400"} alt={quickViewProduct.name} />
            </div>
            <div className="quick-view-info">
              <span className="product-category">{quickViewProduct.category}</span>
              <h2 className="product-title" style={{fontSize: '1.8rem', color: '#1a202c'}}>{quickViewProduct.name}</h2>
              <p style={{color: '#4a5568', margin: '1rem 0'}}>{quickViewProduct.description}</p>
              <div className="product-price" style={{fontSize: '1.5rem', margin: '1.5rem 0'}}>₹{quickViewProduct.price}</div>
              <button 
                className="add-btn" 
                style={{fontSize: '1rem'}} 
                onClick={() => handleAddToCart(quickViewProduct)}
              >
                + Add to Cart
              </button>
              <Link to={`/product/${quickViewProduct._id}`} style={{display: 'block', textAlign: 'center', marginTop: '1rem', color: '#007bff', fontWeight: '500'}}>
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}