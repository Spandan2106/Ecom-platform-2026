import React from 'react';

export default function Terms() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Terms of Service</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3 style={{ marginTop: '1.5rem' }}>1. Introduction</h3>
      <p>Welcome to WE_SELL. By accessing our website and using our services, you agree to be bound by these Terms of Service.</p>

      <h3 style={{ marginTop: '1.5rem' }}>2. Use of Service</h3>
      <p>You must be at least 18 years old to use our services. You agree not to use our platform for any illegal or unauthorized purpose.</p>

      <h3 style={{ marginTop: '1.5rem' }}>3. User Accounts</h3>
      <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

      <h3 style={{ marginTop: '1.5rem' }}>4. Products and Pricing</h3>
      <p>We reserve the right to modify or discontinue any product or service without notice. Prices are subject to change without notice.</p>

      <h3 style={{ marginTop: '1.5rem' }}>5. Limitation of Liability</h3>
      <p>WE_SELL shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
      
      <h3 style={{ marginTop: '1.5rem' }}>6. Governing Law</h3>
      <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

      <h3 style={{ marginTop: '1.5rem' }}>7. Contact Information</h3>
      <p>Questions about the Terms of Service should be sent to us at support@wesell.com.</p>
    </div>
  );
}