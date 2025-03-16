import React from 'react';
import { Link } from 'react-router-dom';
import './Body.css';

const Body = () => {
  return (
    <div className="body-container">
      <h2>Your Ride, Your Way</h2>
     
      <div>
        <button className="request-ride-button">Request Now</button>
        <Link to="/customer/book-ride">
          <button className="request-ride-button">Schedule Ride</button>
        </Link>
      </div>
     
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚖</div>
          <h3 className="feature-title">Quick Pickup</h3>
          <p className="feature-description">
            Our drivers arrive within minutes of your request, ensuring you're never kept waiting.
          </p>
        </div>
       
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3 className="feature-title">Affordable Rates</h3>
          <p className="feature-description">
            Competitive pricing with no hidden fees. Pay only for what you see.
          </p>
        </div>
       
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3 className="feature-title">Safe Rides</h3>
          <p className="feature-description">
            All our drivers are vetted and trained to provide the safest rides in the city.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Body;