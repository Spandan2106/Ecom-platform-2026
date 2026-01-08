import React from 'react';
import '../App.css';

export default function ProductModal({ product, onClose, addToCart }) {
  if (!product) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="modal-image-container">
            <img src={product.imageUrl} alt={product.name} className="modal-image" />
          </div>
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p className="modal-category">{product.category}</p>
            <p className="modal-price">₹{product.price}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '1.2rem' }}>★</span>
                <span style={{ color: 'var(--text)' }}>{product.rating || 'No ratings'}</span>
            </div>
            <p className="modal-description">{product.description}</p>
            <div className="modal-actions">
              {product.stock > 0 ? (
                <button 
                  className="cta-button"
                  onClick={() => addToCart(product)}
                  style={{ width: '100%' }}
                >
                  Add to Cart
                </button>
              ) : (
                <span className="out-of-stock" style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}