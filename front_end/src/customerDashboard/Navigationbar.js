import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navigationbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLoggedIn = true;
  const userName = "John Doe";

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Mega City Cabs</Link>
        <div className="navbar-nav-container">
          <ul className="nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} to="/" onClick={() => handleTabClick('home')}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'about' ? 'active' : ''}`} to="/about" onClick={() => handleTabClick('about')}>About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} to="/contact" onClick={() => handleTabClick('contact')}>Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`} to="/faq" onClick={() => handleTabClick('faq')}>FAQ</Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle user-dropdown" onClick={toggleDropdown}>{userName}</button>
                {dropdownOpen && (
                  <div className="dropdown-menu show">
                    <Link className="dropdown-item" to="/track-ride" onClick={() => {handleTabClick('track-ride'); toggleDropdown();}}>Track Current Ride</Link>
                    <Link className="dropdown-item" to="/history" onClick={() => {handleTabClick('history'); toggleDropdown();}}>History</Link>
                    <Link className="dropdown-item" to="/manage-account" onClick={() => {handleTabClick('manage-account'); toggleDropdown();}}>Manage Account</Link>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/logout" onClick={() => {handleTabClick('logout'); toggleDropdown();}}>Sign Out</Link>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${activeTab === 'login' ? 'active' : ''}`} to="/login" onClick={() => handleTabClick('login')}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${activeTab === 'register' ? 'active' : ''}`} to="/register" onClick={() => handleTabClick('register')}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigationbar;