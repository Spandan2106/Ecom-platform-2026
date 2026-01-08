import React from 'react';

export default function FAQ() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Frequently Asked Questions</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>How do I track my order?</h3>
        <p>Once your order is shipped, you will receive a tracking number via email. You can also view your order status in your Profile under "Order History".</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>What payment methods do you accept?</h3>
        <p>We accept all major credit cards, PayPal, and our exclusive Wallet payment system for faster checkout.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>How does the Wallet work?</h3>
        <p>You can top up your wallet using a credit card. Funds in your wallet can be used to purchase items instantly without entering card details every time.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Can I return an item?</h3>
        <p>Yes, we accept returns within 30 days of purchase. Please visit our Returns page for more details.</p>
      </div>
    </div>
  );
}