import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

// Configure axios to include the token in all requests
const setupAxiosInterceptors = (token) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const AuthService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role.toLowerCase(),
        name: response.data.name,
        userId: response.data.userId
      }));
      setupAxiosInterceptors(response.data.token);
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Reload the page to reset all app state
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Initialize auth state on app load
  initAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      setupAxiosInterceptors(token);
    }
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  hasRole: (role) => {
    const user = AuthService.getCurrentUser();
    return user && user.role === role.toLowerCase();
  }
};

// Initialize auth on import
AuthService.initAuth();

export default AuthService;