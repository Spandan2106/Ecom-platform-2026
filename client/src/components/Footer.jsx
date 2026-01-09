import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem',
          alignItems: 'start'
        }}>
          <div className="footer-brand">
            <h3>WE_SELL</h3>
            <p>Your trusted partner in global commerce. Building the future of e-commerce, one transaction at a time.</p>
          </div>
          
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest products and deals.</p>
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" viewBox="0 0 24 24"><path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2" stroke="none"></circle></svg>
          </a>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} WE_SELL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;