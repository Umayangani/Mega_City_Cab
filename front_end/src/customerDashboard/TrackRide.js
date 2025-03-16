import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingService } from '../api/BookingApiService';
import './TrackRide.css';

const TrackRide = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
 
  useEffect(() => {
    fetchBookingDetails();
   
    // Refresh booking details every 30 seconds
    const interval = setInterval(fetchBookingDetails, 30000);
   
    return () => clearInterval(interval);
  }, [id]);
 
  const fetchBookingDetails = async () => {
    try {
      const response = await BookingService.getBookingById(id);
      setBooking(response.data);
      setCurrentStatus(response.data.status);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Failed to load ride details. Please try refreshing the page.");
      setLoading(false);
    }
  };
 
  // Map status to stages for the tracker
  const getBookingStages = () => {
    const stages = [
      { id: 'booked', name: 'Booked', completed: true },
      { id: 'driver-assigned', name: 'Driver Assigned',
        completed: currentStatus !== 'PENDING' },
      { id: 'on-the-way', name: 'Driver on the way',
        completed: currentStatus === 'CONFIRMED' && booking?.driver },
      { id: 'ride-start', name: 'Ride Started',
        completed: false },
      { id: 'completed', name: 'Completed',
        completed: currentStatus === 'COMPLETED' }
    ];
   
    return stages;
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
 
  const calculateTimeLeft = (dateTimeString) => {
    const rideTime = new Date(dateTimeString).getTime();
    const now = new Date().getTime();
    const difference = rideTime - now;
   
    if (difference <= 0) {
      return 'Pick-up time has arrived';
    }
   
    // Time left calculation
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
   
    let timeLeftText = '';
   
    if (days > 0) {
      timeLeftText += `${days} day${days > 1 ? 's' : ''} `;
    }
   
    if (hours > 0) {
      timeLeftText += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
   
    if (minutes > 0) {
      timeLeftText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
   
    return `${timeLeftText} until pick-up`;
  };
 
  if (loading) {
    return <div className="track-ride-loading">Loading ride details...</div>;
  }
 
  if (error) {
    return (
      <div className="track-ride-error">
        <h3>Error</h3>
        <p>{error}</p>
        <div className="ride-navigation-links">
          <Link to="/customer/bookings" className="back-to-bookings">
            ← Back to My Bookings
          </Link>
          <Link to="/history" className="view-history-link">
            View Ride History
          </Link>
        </div>
      </div>
    );
  }
 
  if (!booking) {
    return (
      <div className="track-ride-error">
        <h3>Ride Not Found</h3>
        <p>The requested ride could not be found.</p>
        <div className="ride-navigation-links">
          <Link to="/customer/bookings" className="back-to-bookings">
            ← Back to My Bookings
          </Link>
          <Link to="/history" className="view-history-link">
            View Ride History
          </Link>
        </div>
      </div>
    );
  }
 
  return (
    <div className="track-ride-container">
      <div className="track-ride-header">
        <h2>Track Your Ride</h2>
        <div className="ride-navigation-links">
          <Link to="/customer/bookings" className="back-to-bookings">
            ← Back to My Bookings
          </Link>
          <Link to="/history" className="view-history-link">
            View Ride History →
          </Link>
        </div>
      </div>
     
      <div className="ride-info-card">
        <div className="ride-status-header">
          <h3>Ride #{booking.id}</h3>
          <div className={`ride-status ${currentStatus.toLowerCase()}`}>
            {currentStatus}
          </div>
        </div>
       
        <div className="ride-time-info">
          <div className="scheduled-time">
            <span className="time-label">Scheduled for:</span>
            <span className="time-value">{formatDateTime(booking.booking_time)}</span>
          </div>
          {currentStatus !== 'COMPLETED' && (
            <div className="time-left">
              {calculateTimeLeft(booking.booking_time)}
            </div>
          )}
        </div>
       
        <div className="ride-locations">
          <div className="location pickup">
            <div className="location-icon pickup-icon">⬤</div>
            <div className="location-text">
              <div className="location-label">Pick-up:</div>
              <div className="location-address">{booking.pickup_location}</div>
            </div>
          </div>
          <div className="location-divider"></div>
          <div className="location destination">
            <div className="location-icon destination-icon">⬤</div>
            <div className="location-text">
              <div className="location-label">Destination:</div>
              <div className="location-address">{booking.destination}</div>
            </div>
          </div>
        </div>
       
        <div className="ride-details-section">
          <h4>Ride Details</h4>
         
          <div className="ride-detail-row">
            <div className="detail-label">Amount:</div>
            <div className="detail-value">${booking.amount.toFixed(2)}</div>
          </div>
         
          <div className="ride-detail-row">
            <div className="detail-label">Payment Status:</div>
            <div className="detail-value">{booking.payment_status}</div>
          </div>
         
          {booking.vehicle && (
            <>
              <div className="ride-detail-row">
                <div className="detail-label">Vehicle:</div>
                <div className="detail-value">
                  {booking.vehicle.model} ({booking.vehicle.type})
                </div>
              </div>
              {booking.vehicle.plateNumber && (
                <div className="ride-detail-row">
                  <div className="detail-label">Plate Number:</div>
                  <div className="detail-value">{booking.vehicle.plateNumber}</div>
                </div>
              )}
            </>
          )}
        </div>
       
        {booking.driver ? (
          <div className="driver-info-section">
            <h4>Driver Information</h4>
           
            <div className="driver-details">
              <div className="driver-name-rating">
                <div className="driver-name">{booking.driver.name}</div>
                {booking.driver.rating && (
                  <div className="driver-rating">★ {booking.driver.rating.toFixed(1)}</div>
                )}
              </div>
             
              {booking.driver.phoneNumber && (
                <div className="driver-contact">
                  <a href={`tel:${booking.driver.phoneNumber}`} className="call-driver-button">
                    <span className="phone-icon">📞</span> Call Driver
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="driver-pending-section">
            <h4>Driver Assignment</h4>
            <p>A driver will be assigned to your ride shortly.</p>
          </div>
        )}
       
        <div className="ride-progress-tracker">
          <h4>Ride Progress</h4>
         
          <div className="progress-stages">
            {getBookingStages().map((stage, index) => (
              <div
                key={stage.id}
                className={`progress-stage ${stage.completed ? 'completed' : ''}`}
              >
                <div className="stage-indicator">
                  {stage.completed ? '✓' : index + 1}
                </div>
                <div className="stage-name">{stage.name}</div>
                {index < getBookingStages().length - 1 && (
                  <div className={`stage-connector ${stage.completed ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
       
        {currentStatus === 'CONFIRMED' && (
          <div className="ride-actions">
            <button className="cancel-ride-button">
              Cancel Ride
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackRide;