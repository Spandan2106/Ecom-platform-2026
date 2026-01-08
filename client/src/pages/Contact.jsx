import React, { useState } from "react";
import toast from "react-hot-toast";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container animate-fade-in">
      <div className="contact-header animate-slide-up">
        <h1>Get in Touch</h1>
        <p>Have questions? We'd love to hear from you.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info-list animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="contact-info-item">
            <div className="icon-box blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="info-content">
              <h3>Email Us</h3>
              <p><a href = "mailto:support@wesell.com">support@wesell.com</a></p>
              <p><a href = "mailto:headoffice@wesell.com">headoffice@wesell.com</a></p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="icon-box green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div className="info-content">
              <h3>Call Us</h3>
              <p>+91 123 456 7890</p>
              <p>+1 987 654 3210</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="icon-box yellow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="info-content">
              <h3>Visit Us</h3>
              <p><strong>India:</strong> 123 E-com Street, Tech City</p>
              <p><strong>USA:</strong> 123 Market St, San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="form-input"
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="form-input"
                placeholder="Your Email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                rows="4"
                className="form-textarea"
                placeholder="How can we help you?"
              />
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="map-section animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="map-title">Our Location</h2>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.096820779676!2d-122.42172!3d37.78324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzU5LjciTiAxMjLCsDI1JzE4LjIiVw!5e0!3m2!1sen!2sus!4v1632990000000!5m2!1sen!2sus" 
          width="100%" 
          height="450" 
          style={{border:0}} 
          allowFullScreen="" 
          loading="lazy"
          title="Google Maps"
        ></iframe>
      </div>
    </div>
  );
}