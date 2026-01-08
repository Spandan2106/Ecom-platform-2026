import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <p>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
          By clicking "Accept All", you consent to our use of cookies.
        </p>
      </div>
      <div className="cookie-actions">
        <button className="cookie-btn accept" onClick={acceptCookies}>Accept All</button>
        <button className="cookie-btn decline" onClick={() => setIsVisible(false)}>Decline</button>
      </div>
    </div>
  );
};

export default CookieConsent;