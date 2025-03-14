import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  // Ensure the page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section - Full Height */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="bounce-tag">
            <span className="gradient-tag">Your Ride, Your Way</span>
          </div>
          
          <h1 className="hero-title">
            <span className="gradient-text">MEGA CITY CABS</span>
          </h1>
          
          <p className="hero-description">
            Premium cab service for the modern urban traveler. Reliable, comfortable, and always on time.
          </p>
          
          <div className="hero-buttons">
            <Link to="/book-now" className="book-now-btn">
              Book Now
            </Link>
            <Link to="/download-app" className="download-app-btn">
              Download App
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Booking Floating Section */}
      <div className="booking-container">
        <div className="quick-booking">
          <div className="booking-content">
            <div className="booking-title">
              <h2>Quick Booking</h2>
              <p>Get a ride in minutes!</p>
            </div>
            
            <div className="booking-form">
              <select className="pickup-select">
                <option>Select Pickup</option>
                <option>Downtown</option>
                <option>Airport</option>
                <option>Business District</option>
              </select>
              
              <select className="destination-select">
                <option>Select Destination</option>
                <option>Downtown</option>
                <option>Airport</option>
                <option>Business District</option>
              </select>
              
              <button className="get-cab-btn">
                Get a Cab
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Fleet Section */}
      <div className="fleet-section">
        <div className="section-container">
          <div className="section-badge">
            <span>Premium Fleet</span>
          </div>
          
          <h2 className="section-title">
            Choose Your Perfect Ride
          </h2>
          
          <div className="fleet-cards">
            {/* Economy */}
            <div className="fleet-card economy">
              <div className="card-image">
                <img 
                  src="/images/car1.jpg" 
                  alt="Economy Car"
                  className="car-image"
                />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>Economy</h3>
                  <span className="price-tag">From $9</span>
                </div>
                <p>Affordable and efficient cars for everyday city travel.</p>
                <Link to="/economy" className="card-link">
                  View Details →
                </Link>
              </div>
            </div>
            
            {/* Premium */}
            <div className="fleet-card premium">
              <div className="card-image">
                <img 
                  src="/images/car2.jpg" 
                  alt="Premium Car"
                  className="car-image"
                />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>Premium</h3>
                  <span className="price-tag premium-price">From $14</span>
                </div>
                <p>Comfort and style for business travel and special occasions.</p>
                <Link to="/premium" className="card-link premium-link">
                  View Details →
                </Link>
              </div>
            </div>
            
            {/* Luxury */}
            <div className="fleet-card luxury">
              <div className="card-image">
                <img 
                  src="/images/car3.jpg" 
                  alt="Luxury SUV"
                  className="car-image"
                />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>Luxury SUV</h3>
                  <span className="price-tag luxury-price">From $22</span>
                </div>
                <p>Spacious luxury vehicles for groups and executive travel.</p>
                <Link to="/luxury" className="card-link luxury-link">
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* App Features Section */}
      <div className="features-section">
        <div className="section-container">
          <div className="features-header">
            <h2>Smart Features for Smart Riders</h2>
            <p>Download our app for a seamless booking experience with advanced features.</p>
          </div>
          
          <div className="features-cards">
            <div className="feature-card">
              <div className="feature-icon ride-sharing">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3>Ride Sharing</h3>
              <p>Share your ride and split the fare with other passengers heading in the same direction.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon real-time">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3>Real-time Tracking</h3>
              <p>Track your driver in real-time and share your trip status with friends and family.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon smart-pricing">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
              <h3>Smart Pricing</h3>
              <p>Transparent fare estimates and multiple payment options for your convenience.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="testimonials-section">
        <div className="section-container">
          <div className="testimonials-header">
            <span className="section-badge">Testimonials</span>
            <h2>What Our Riders Say</h2>
          </div>
          
          <div className="testimonials-cards">
            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-avatar pink">S</div>
                <div>
                  <h3>Sarah Williams</h3>
                  <div className="rating">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p>"The app is incredibly user-friendly and the drivers are always professional. Love the real-time tracking feature!"</p>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-avatar indigo">M</div>
                <div>
                  <h3>Michael Johnson</h3>
                  <div className="rating">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p>"As a business traveler, I appreciate the premium service and punctuality. Mega City Cabs has never let me down!"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Promo */}
      <div className="app-promo-section">
        <div className="section-container">
          <div className="app-promo-card">
            <h2>Download Our App</h2>
            <p>Get exclusive deals and a faster booking experience when you use our mobile app.</p>
            
            <div className="app-buttons">
              <Link to="/ios-app" className="app-button ios">
                <svg className="app-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <div className="app-text">
                  <div className="app-text-small">Download on the</div>
                  <div className="app-text-large">App Store</div>
                </div>
              </Link>
              
              <Link to="/android-app" className="app-button android">
                <svg className="app-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                <div className="app-text">
                  <div className="app-text-small">GET IT ON</div>
                  <div className="app-text-large">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-logo">
                <span className="gradient-text">MEGA CITY CABS</span>
              </h3>
              <p>Your premium ride service in the heart of the city.</p>
            </div>
            
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/fleet">Our Fleet</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Contact</h4>
              <ul className="footer-contact">
                <li>1234 Urban Street, Mega City</li>
                <li>contact@megacitycabs.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" className="social-icon twitter">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" /></svg>
                </a>
                <a href="#" className="social-icon facebook">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>
                </a>
                <a href="#" className="social-icon instagram">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="copyright">
            <p>&copy; 2025 Mega City Cabs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;