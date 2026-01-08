import React from 'react';

export default function Privacy() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
      
      <h3 style={{ marginTop: '1.5rem' }}>Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This includes your name, email, address, and payment information.</p>

      <h3 style={{ marginTop: '1.5rem' }}>How We Use Your Information</h3>
      <p>We use your information to process orders, provide customer support, and improve our services. We do not sell your personal data to third parties.</p>

      <h3 style={{ marginTop: '1.5rem' }}>Security</h3>
      <p>We implement industry-standard security measures to protect your data. Your payment information is encrypted and processed securely.</p>

      <h3 style={{ marginTop: '1.5rem' }}>Contact Us</h3>
      <p>If you have questions about this policy, please contact us at privacy@wesell.com.</p>
    </div>
  );
}