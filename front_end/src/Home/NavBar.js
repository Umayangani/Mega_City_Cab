import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NavBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  
  // Set the active tab based on current location whenever location changes
  useEffect(() => {
    const path = location.pathname.substring(1); // Remove leading '/'
    if (path === '') {
      setActiveTab('home');
    } else if (path.startsWith('login')) {
      setActiveTab('login');
    } else if (path.startsWith('register')) {
      setActiveTab('register');
    } else if (path.includes('bookings')) {
      setActiveTab('bookings');
    } else if (path.includes('about')) {
      setActiveTab('about');
    } else if (path.includes('contact')) {
      setActiveTab('contact');
    }
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid d-flex justify-content-between">
        {/* Left Side: Mega City Cabs */}
        <Link className="navbar-brand" to="/">Mega City Cabs</Link>
        
        {/* Hamburger menu for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Right Side: Nav Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                to="/login"
                onClick={(e) => setActiveTab('home')}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                to="/bookings"
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                to="/about"
                onClick={() => setActiveTab('about')}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                to="/contact"
                onClick={() => setActiveTab('contact')}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                to="/login"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  // Clear any stored user data that might be triggering auto-redirect
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  window.location.href = '/login'; // Force navigation
                }}
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                to="/register"
                onClick={(e) => setActiveTab('register')}
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;