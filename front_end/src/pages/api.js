import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Set a timeout to avoid hanging requests
});

// Enhanced error logging interceptor
apiClient.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || {});
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor for better error handling
apiClient.interceptors.response.use(
  response => {
    console.log(`API Response from ${response.config.url}:`, response.status, response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        url: error.config.url,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('API No Response:', {
        url: error.config?.url,
        request: error.request
      });
    } else {
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Vehicle API services
export const VehicleService = {
  // Add a new vehicle
  addVehicle: (vehicleData) => {
    return apiClient.post('/vehicles', vehicleData);
  },
  
  // Get all vehicles
  getAllVehicles: () => {
    return apiClient.get('/vehicles');
  },
  
  // Get vehicles grouped by type
  getVehiclesByType: () => {
    return apiClient.get('/vehicles/by-type');
  },
  
  // Search vehicles
  searchVehicles: (plateNumber, driverId) => {
    let url = '/vehicles/search?';
    const params = [];
    
    if (plateNumber) {
      params.push(`plateNumber=${encodeURIComponent(plateNumber)}`);
    }
    
    if (driverId) {
      params.push(`driverId=${driverId}`);
    }
    
    return apiClient.get(url + params.join('&'));
  },
  
  // Get vehicle by ID
  getVehicleById: (id) => {
    if (!id) {
      return Promise.reject(new Error("Vehicle ID is required"));
    }
    return apiClient.get(`/vehicles/${id}`);
  },
  
  // Update vehicle
  updateVehicle: (id, vehicleData) => {
    if (!id) {
      return Promise.reject(new Error("Vehicle ID is required"));
    }
    return apiClient.put(`/vehicles/${id}`, vehicleData);
  },
  
  // Delete vehicle
  deleteVehicle: (id) => {
    if (!id) {
      return Promise.reject(new Error("Vehicle ID is required"));
    }
    return apiClient.delete(`/vehicles/${id}`);
  }
};

// Driver API services
export const DriverService = {
  getAllDrivers: () => {
    return apiClient.get('/drivers');
  },
  
  getDriverById: (id) => {
    if (!id) {
      return Promise.reject(new Error("Driver ID is required"));
    }
    return apiClient.get(`/drivers/${id}`);
  }
};

// Create a named API services object before exporting
const apiServices = { VehicleService, DriverService };

export default apiServices;