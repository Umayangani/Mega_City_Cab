import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid d-flex justify-content-between">
        {/* Left Side: Mega City Cabs */}
        <Link className="navbar-brand" to="/">Mega City Cabs</Link>
        
        {/* Right Side: Nav Links */}
        <ul className="nav ms-auto">
          {['home', 'bookings', 'about', 'contact', 'login'].map((tab) => (
            <li className="nav-item" key={tab}>
              <Link
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                to={tab === 'home' ? '/' : `/${tab}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <Link
              className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
              to="/register"
              onClick={() => handleTabClick('register')}
            >
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;