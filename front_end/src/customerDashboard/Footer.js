import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-heading">Mega City Cabs</h5>
            <p className="footer-text">
              Your reliable transportation partner in the city. Available 24/7 for all your ride needs.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-heading">Explore</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-heading">Download Our App</h5>
            <p className="footer-text">Get the best experience with our mobile app</p>
            <div className="app-buttons">
              <a href="#" className="app-button">
                <i className="bi bi-apple"></i> App Store
              </a>
              <a href="#" className="app-button">
                <i className="bi bi-google-play"></i> Google Play
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Mega City Cabs. All rights reserved.</p>
          <p>
            <Link to="/privacy">Privacy Policy</Link> | 
            <Link to="/terms"> Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;