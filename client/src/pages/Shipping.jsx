import React from 'react';

export default function Shipping() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shipping Information</h1>
      
      <h3 style={{ marginTop: '1.5rem' }}>Shipping Methods</h3>
      <p>We offer the following shipping options:</p>
      <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
        <li><strong>Standard Shipping:</strong> 5-7 business days (Free on orders over ₹500)</li>
        <li><strong>Express Shipping:</strong> 2-3 business days (₹100)</li>
        <li><strong>Next Day Delivery:</strong> Available for select pin codes (₹250)</li>
      </ul>

      <h3 style={{ marginTop: '1.5rem' }}>Order Processing</h3>
      <p>Orders are processed within 24 hours. You will receive a confirmation email with tracking details once your order is dispatched.</p>

      <h3 style={{ marginTop: '1.5rem' }}>International Shipping</h3>
      <p>Currently, we only ship within India. We are working on expanding to international locations soon.</p>
    </div>
  );
}