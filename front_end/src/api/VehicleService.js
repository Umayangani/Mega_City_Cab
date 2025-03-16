import axios from 'axios';

// Get the API base URL from environment variables or use a default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Get the token from localStorage for authentication
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const VehicleService = {
  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/vehicles`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Get a specific vehicle by ID
  getVehicleById: async (vehicleId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/vehicles/${vehicleId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${vehicleId}:`, error);
      throw error;
    }
  },

  // Get available vehicles for a specific date and time
  getAvailableVehicles: async (datetime) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/vehicles/available?datetime=${datetime}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching available vehicles:', error);
      throw error;
    }
  },

  // Create a new vehicle (admin only)
  createVehicle: async (vehicleData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/vehicles`,
        vehicleData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update an existing vehicle (admin only)
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/vehicles/${vehicleId}`,
        vehicleData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error updating vehicle with ID ${vehicleId}:`, error);
      throw error;
    }
  },

  // Delete a vehicle (admin only)
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/vehicles/${vehicleId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${vehicleId}:`, error);
      throw error;
    }
  }
};

export default VehicleService;