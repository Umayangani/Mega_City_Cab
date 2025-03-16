import axios from 'axios';

// Get the API base URL from environment variables or use a default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Get the token from localStorage for authentication
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const BookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/create`,
        bookingData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get all bookings for the current customer
  getCustomerBookings: async (customerId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/customer/${customerId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw error;
    }
  },

  // Get upcoming bookings for the current customer
  getCustomerUpcomingBookings: async (customerId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/customer/${customerId}/upcoming`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      throw error;
    }
  },

  // Get completed bookings for the current customer
  getCustomerCompletedBookings: async (customerId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/customer/${customerId}/completed`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      throw error;
    }
  },

  // Get a specific booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/${bookingId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error fetching booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/cancel`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error cancelling booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  // Complete a booking (typically used by drivers)
  completeBooking: async (bookingId, completionData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/complete`,
        completionData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error completing booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  // Process payment for a booking
  processPayment: async (bookingId, paymentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/${bookingId}/payment`,
        paymentData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error processing payment for booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  // Rate a driver after completed booking
  rateDriver: async (bookingId, ratingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/${bookingId}/rate`,
        ratingData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error rating driver for booking with ID ${bookingId}:`, error);
      throw error;
    }
  }
};

export default BookingService;