import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const validateForm = () => {
    const newErrors = {};
   
    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
   
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
   
    if (!validateForm()) {
      return;
    }
   
    setLoading(true);
    setError('');
   
    try {
      console.log('Sending login data:', formData);
      
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
     
      console.log('Login response:', response.data);
      
      if (response.data) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
       
        // Redirect based on role
        switch (response.data.role) {
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'DRIVER':
            navigate('/driver/dashboard');
            break;
          case 'CUSTOMER':
            navigate('/customer/dashboard');
            break;
          case 'RECEPTIONIST':
            navigate('/receptionist/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subheading">Sign in to your Mega City Cabs account</p>
       
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
       
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
         
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
         
          <div className="form-action">
            <div className="remember-forgot">
              <div className="checkbox">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
            </div>
           
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
         
          <div className="register-link">
            Don't have an account? <a href="/register">Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;