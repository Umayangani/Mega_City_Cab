import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookingService } from '../services/BookingApiService';
import './History.css';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const response = await BookingService.getUserBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking history:", err);
      setError("Failed to load booking history. Please try refreshing the page.");
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="history-loading">Loading booking history...</div>;
  }

  if (error) {
    return (
      <div className="history-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="history-empty">
        <h2>Ride History</h2>
        <div className="empty-state">
          <div className="empty-icon">🚖</div>
          <h3>No rides yet</h3>
          <p>You haven't taken any rides with us yet. Book your first ride now!</p>
          <Link to="/" className="book-ride-button">Book a Ride</Link>
        </div>
      </div>
    );
  }

  // Filter active rides (PENDING or CONFIRMED)
  const activeRides = bookings.filter(booking => 
    booking.status === 'PENDING' || booking.status === 'CONFIRMED'
  );

  // Past rides (COMPLETED or CANCELLED)
  const pastRides = bookings.filter(booking => 
    booking.status === 'COMPLETED' || booking.status === 'CANCELLED'
  );

  return (
    <div className="history-container">
      <h2>Ride History</h2>
      
      {activeRides.length > 0 && (
        <section className="active-rides-section">
          <h3>Active Rides</h3>
          <div className="booking-list">
            {activeRides.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">Ride #{booking.id}</div>
                  <div className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>
                
                <div className="booking-time">
                  {formatDateTime(booking.booking_time || booking.scheduledDatetime)}
                </div>
                
                <div className="booking-route">
                  <div className="booking-location pickup">
                    <div className="location-dot pickup-dot"></div>
                    <div className="location-address">{booking.pickup_location || booking.pickupLocation}</div>
                  </div>
                  <div className="route-line"></div>
                  <div className="booking-location destination">
                    <div className="location-dot destination-dot"></div>
                    <div className="location-address">{booking.destination}</div>
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="booking-amount">
                    ${parseFloat(booking.amount).toFixed(2)}
                  </div>
                  <Link to={`/track-ride/${booking.id}`} className="track-ride-button">
                    Track Ride
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      <section className="past-rides-section">
        <h3>Past Rides</h3>
        <div className="booking-list">
          {pastRides.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-id">Ride #{booking.id}</div>
                <div className={`booking-status ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="booking-time">
                {formatDateTime(booking.booking_time || booking.scheduledDatetime)}
              </div>
              
              <div className="booking-route">
                <div className="booking-location pickup">
                  <div className="location-dot pickup-dot"></div>
                  <div className="location-address">{booking.pickup_location || booking.pickupLocation}</div>
                </div>
                <div className="route-line"></div>
                <div className="booking-location destination">
                  <div className="location-dot destination-dot"></div>
                  <div className="location-address">{booking.destination}</div>
                </div>
              </div>
              
              <div className="booking-details">
                <div className="booking-amount">
                  ${parseFloat(booking.amount).toFixed(2)}
                </div>
                <Link to={`/track-ride/${booking.id}`} className="view-details-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default History;