import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    name: '',
    address: '',
    nic: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};
   
    // Improved email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
   
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
   
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
   
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
   
    // Validate phone (optional but should be valid if provided)
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
   
    // Validate customer name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
   
    // Validate NIC
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!nicRegex.test(formData.nic)) {
      newErrors.nic = 'Please enter a valid NIC number (9 digits + v/x or 12 digits)';
    }
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
   
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Reset previous states
    setSuccess(false);
    setError('');
    setLoading(true);

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }
   
    try {
      // Format the data for the API
      const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone || null,
        role: 'CUSTOMER', // Default role for registration
        customerDetails: {
          name: formData.name,
          address: formData.address || null,
          nic: formData.nic
        }
      };
     
      // Make API call to register with full error handling
      const response = await axios.post('http://localhost:8080/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
     
      // Handle successful registration
      setSuccess(true);
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        name: '',
        address: '',
        nic: ''
      });
     
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Comprehensive error handling
      console.error('Full error object:', err);
      
      // Check for specific error responses
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = err.response.data.message || 
                             err.response.data.error || 
                             'Registration failed. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      // Ensure loading state is always turned off
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account</h2>
        <p className="subheading">Join Mega City Cabs today and enjoy premium rides!</p>
       
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}
       
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
       
        <form onSubmit={handleSubmit}>
          {/* Rest of the form remains the same as in the original component */}
          <div className="form-sections">
            <div className="form-section">
              <h3>Account Information</h3>
             
              <div className="form-group">
                <label htmlFor="username">Username <span className="required">*</span></label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>
             
              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
             
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
             
              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
             
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
           
            <div className="form-section">
              <h3>Personal Information</h3>
             
              <div className="form-group">
                <label htmlFor="name">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
             
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                ></textarea>
              </div>
             
              <div className="form-group">
                <label htmlFor="nic">NIC Number <span className="required">*</span></label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  className={`form-control ${errors.nic ? 'is-invalid' : ''}`}
                  value={formData.nic}
                  onChange={handleChange}
                  placeholder="Enter your NIC number"
                />
                {errors.nic && <div className="invalid-feedback">{errors.nic}</div>}
              </div>
            </div>
          </div>
         
          <div className="form-footer">
            <p className="terms">
              By creating an account, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
           
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </div>
           
            <div className="login-link">
              Already have an account? <a href="/login">Log in here</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;