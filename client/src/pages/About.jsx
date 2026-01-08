import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./About.css";

const StatCounter = ({ label, value }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  
  // Extract non-numeric prefix/suffix and the number
  // e.g., "$50B+" -> prefix="$", number=50, suffix="B+"
  const match = useMemo(() => value.match(/^(\D*)(\d+)(\D*)$/), [value]);

  useEffect(() => {
    if (!match) return;

    const end = parseInt(match[2], 10);
    const duration = 5000; // 5 seconds
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [match]);

  if (!match) {
    return (
      <div className="stat-item">
        <span className="stat-number">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    );
  }

  return (
    <div className="stat-item" ref={nodeRef}>
      <span className="stat-number">{match[1]}{count}{match[3]}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    toast.success("Application submitted successfully! We will contact you soon.");
    setShowApplicationModal(false);
  };

  const stats = [
    { label: "Users", value: "110M+" },
    { label: "Products Sold", value: "160M+" },
    { label: "Transacted", value: "$90B+" },
    { label: "Net Worth", value: "$20B" },
    { label: "Countries", value: "82" },
    { label: "Employees", value: "200k+" },
    { label: "Engineers", value: "2k+" },
    { label: "Founded", value: "2020" },
    { label: "Offices", value: "75" },
    { label: "Warehouses", value: "250" },
    { label: "Daily Visitors", value: "5M+" },
    { label: "Customer Satisfaction", value: "98%" },
    { label: "Return Rate", value: "5%" },
    { label: "Mobile App Downloads", value: "50M+" },
    { label: "Average Delivery Time", value: "3 Days" },
    { label: "Support Tickets Resolved", value: "1M+" }
  ];

  const timelineEvents = [
    { year: "2020", title: "Founded", description: "WE_SELL.com was founded by Spandan Das in a his home first as a website in San Francisco." },
    { year: "2021", title: "First Funding", description: "Secured $5 Million in seed funding from top venture capitalists." },
    { year: "2021", title: "10 Million Users", description: "Reached our first major milestone of 10 million active users." },
    { year: "2022", title: "Global Expansion", description: "Launched operations in Europe and Asia." },
    { year: "2022", title: "50 Million Products", description: "Surpassed 50 million products listed on our platform." },
    { year: "2023", title: "Mobile App", description: "Released our top-rated mobile application for iOS and Android." },
    { year: "2024", title: "$20B Transactions", description: "Facilitated over $20 Billion in GMV." },
    { year: "2024", title: "20 Million Users", description: "Doubled our user base to 20 million active users." },
    { year: "2025", title: "Sustainability Goal", description: "Achieved 100% carbon neutral shipping." },
    { year: "2025", title: "100 Million Products", description: "Reached 100 million products listed on our platform." },
    { year: "2025", title : "Global Leader", description: "Recognized as a top 10 global e-commerce platform." },
    { year: "2026", title: "30 Million Users", description: "Projected to reach 30 million active users." },
    { year: "2026", title: "New Frontiers", description: "Expanding into IT and Energy sectors with over 2,000 engineers." },
  ];

  const teamMembers = [
    {
      name: "Spandan Das",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#", dribbble: "#" }
    },
    {
      name: "Emily Davis",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#", twitter: "#" }
    },
    {
      name: "David Kim",
      role: "Lead Engineer",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#", github: "#" }
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Energy",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Marcus Johnson",
      role: "IT Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      socials: { linkedin: "#" }
    }
  ];

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, Stripe, and our own We Sell Pay Balance for a seamless checkout experience."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy on most items. Please visit our returns page for more details and to initiate a return."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive an email with a tracking number. You can also track your order from your Order History page."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship to select international destinations. Shipping options and fees will be calculated at checkout."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via the Contact Us page, email us at support@we_sell.com, or call us at 1-800-WE-SELL."
    },
    {
      question: "Where are you located?",
      answer: "We are headquartered in San Francisco, California, with fulfillment centers across the United States and also in 82 countries to ensure fast delivery."
    },
    {
      question: "How do I create an account?",
      answer: "Click on the Sign Up button at the top right corner of our homepage and fill in the required details to create your account."
    }
    ,
    {
      question: "What security measures are in place for online transactions?",
      answer: "We use industry-standard encryption and security protocols to protect your personal and payment information during online transactions."
    },
    {
      question: "Can I change or cancel my order after placing it?",
      answer: "Orders can be modified or cancelled within 1 hour of placement. Please contact our customer support team as soon as possible to make changes."
    },
    {
      question: "Do you offer gift cards?",
      answer: "Yes, we offer digital gift cards in various denominations. You can purchase them from our Gift Cards page."
    },
    {
      question: "How do I apply a discount code to my order?",
      answer: "You can enter your discount code during the checkout process in the designated field before finalizing your purchase."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="about-container animate-fade-in">
      <div className="about-hero animate-slide-up">
        <h1>About Us</h1>
        <p className="about-hero-text">
          Building the future of e-commerce, one transaction at a time.
          A platform dedicated to providing seamless shopping experiences with innovation and trust.
        </p>
      </div>

      <div className="about-grid">
        <div className="info-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="section-title">Our Story</h2>
          <p className="text-muted">
            Established on 12th December, 2020, WE_SELL.com started with a simple idea: to make high-quality products accessible to everyone. 
            Founded by Spandan Das and his visionary team, we have grown from a small startup to a trusted name in the digital marketplace.
          </p>
          <p className="text-muted">
            We have expanded our reach to serve customers in over 82 countries. Our platform now hosts over 50 million users and has facilitated over $90 Billion in transactions.
            With a dedicated workforce of over 200,000 employees, including more than 2,000 software engineers, and a net worth of $20 Billion, we ensure excellence in every interaction.
            We are also rapidly expanding into the IT and Energy sectors.
          </p>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCounter key={index} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
        <div className="info-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="section-title">Our Mission</h2>
          <p className="text-muted">
            Our mission is to make online shopping easy, reliable, and fun. We believe in the power of technology to transform the way we shop, 
            bringing innovation and quality to every transaction. We are committed to delivering exceptional customer service.
          </p>
          <p className="text-muted">
            We strive to create a community where customers feel valued and empowered.
            Our goal is to be more than just an e-commerce platform; we want to be a trusted partner in our customers' shopping journeys.
            We are dedicated to sustainability and ethical business practices.
          </p>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team" className="mission-image" />
          </div>
        </div>
      </div>

      <div className="timeline-section animate-slide-up">
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Our Journey</h2>
        <div className="timeline-container">
          {timelineEvents.map((event, index) => (
            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-year">{event.year}</span>
                <h3 className="timeline-title">{event.title}</h3>
                <p className="text-muted" style={{ marginBottom: 0 }}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="team-section animate-slide-up">
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.image} alt={member.name} className="team-image" />
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <div className="team-socials">
                <a href={member.socials.linkedin} className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href={member.socials.twitter} className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button className="cta-button" onClick={() => setShowApplicationModal(true)}>Join Our Team</button>
        </div>
      </div>

      <div className="features-section animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Delivery</h3>
            <p className="text-muted">We ensure your products reach you as quickly as possible.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Quality Products</h3>
            <p className="text-muted">We source only the best items for our customers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p className="text-muted">Our team is always here to help you with any queries.</p>
          </div>
        </div>
      </div>
      
      <div className="faq-section animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h4>{faq.question}</h4>
                <span className={`faq-toggle ${openFaq === index ? 'open' : ''}`}>+</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="cta-container">
        <Link to="/shop">
          <button className="cta-button">
            Start Shopping
          </button>
        </Link>
      </div>

      {/* Job Application Modal */}
      {showApplicationModal && (
        <div className="modal-overlay" onClick={() => setShowApplicationModal(false)}>
          <div className="modal-content application-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowApplicationModal(false)}>×</button>
            <h2>Join Our Team</h2>
            <form onSubmit={handleApplicationSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" required placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <select className="form-input">
                  <option>Software Engineer</option>
                  <option>Product Manager</option>
                  <option>Designer</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Resume/CV</label>
                <input type="file" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea className="form-textarea" rows="4" placeholder="Tell us about yourself..."></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit Application</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}