import React from 'react';

export default function Returns() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Returns & Refunds</h1>
      
      <p>We want you to be completely satisfied with your purchase. If you are not, we offer a hassle-free return policy.</p>
      
      <h3 style={{ marginTop: '1.5rem' }}>Return Policy</h3>
      <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
        <li>Items must be returned within 30 days of delivery.</li>
        <li>Items must be unused and in original packaging.</li>
        <li>Return shipping is free for defective items.</li>
      </ul>

      <h3 style={{ marginTop: '1.5rem' }}>How to Initiate a Return</h3>
      <p>Please contact our support team at support@wesell.com with your Order ID to start the return process.</p>

      <h3 style={{ marginTop: '1.5rem' }}>Refunds</h3>
      <p>Once we receive your return, we will inspect it and process your refund to your original payment method or Wallet within 5-7 business days.</p>
    </div>
  );
}