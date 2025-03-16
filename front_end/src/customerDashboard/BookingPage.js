import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiServices from '../pages/api';
import BookingService from '../api/BookingService';
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [bill, setBill] = useState(null);
 
  const [formData, setFormData] = useState({
    pickup_location: '',
    destination: '',
    scheduled_time: '',
    scheduled_date: '',
    vehicle_id: '',
    notes: ''
  });
 
  const [errors, setErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
 
  // Vehicle types for dropdown
  const vehicleTypes = [
    "BUDGET CAR",
    "STANDARD CAR",
    "JEEP",
    "VAN",
    "LUXURY"
  ];
  // Fetch all vehicle types when component mounts
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        // Fetch all vehicle types to show in the dropdown
        const response = await apiServices.VehicleService.getAllVehicles();
        if (response.status === 200) {
          setVehicles(response.data);
        } else {
          throw new Error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
       
        // Mock data for demonstration
        setVehicles([
          {
            id: 1,
            name: "Economy Sedan",
            model: "Toyota Corolla",
            type: "SEDAN",
            rate: 3.50
          },
          {
            id: 2,
            name: "Premium Sedan",
            model: "Honda Accord",
            type: "SEDAN",
            rate: 4.50
          },
          {
            id: 3,
            name: "Standard SUV",
            model: "Toyota RAV4",
            type: "SUV",
            rate: 5.00
          },
          {
            id: 4,
            name: "Premium SUV",
            model: "BMW X3",
            type: "SUV",
            rate: 6.50
          },
          {
            id: 5,
            name: "Luxury",
            model: "Mercedes E-Class",
            type: "LUXURY",
            rate: 8.00
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleTypes();
  }, []);
  
  // Check for available vehicles when date or time changes
  useEffect(() => {
    if (formData.scheduled_date && formData.scheduled_time) {
      checkAvailableVehicles();
    }
  }, [formData.scheduled_date, formData.scheduled_time]);
  
  const checkAvailableVehicles = async () => {
    if (!formData.scheduled_date || !formData.scheduled_time) {
      return;
    }
    setCheckingAvailability(true);
    setAvailableVehicles([]);
    setFormData(prev => ({ ...prev, vehicle_id: '' }));
    try {
      // Format date and time for backend
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`;
     
      // API call to check available vehicles for the selected date/time
      const response = await fetch(`/api/vehicles/available?datetime=${scheduledDateTime}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch available vehicles');
      }
      const availableVehiclesData = await response.json();
      setAvailableVehicles(availableVehiclesData);
     
      // Clear any previous vehicle selection since availability may have changed
      if (formData.vehicle_id) {
        const isStillAvailable = availableVehiclesData.some(v => v.id.toString() === formData.vehicle_id);
        if (!isStillAvailable) {
          setFormData(prev => ({ ...prev, vehicle_id: '' }));
        }
      }
    } catch (error) {
      console.error('Error checking vehicle availability:', error);
     
      // For demo purposes, set all vehicles as available
      setAvailableVehicles(vehicles);
    } finally {
      setCheckingAvailability(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
   
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
   
    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = 'Pickup location is required';
    }
   
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
   
    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Date is required';
    }
   
    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Time is required';
    }
   
    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Please select a vehicle';
    }
   
    return newErrors;
  };
  
  const calculateBill = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Mock distance calculation (in a real application, use a maps API)
    const estimatedDistance = Math.floor(Math.random() * 20) + 5; // Random between 5-25 km
    // Find the selected vehicle to get its rate
    const selectedVehicle = vehicles.find(v => v.id.toString() === formData.vehicle_id);
   
    // Calculate fare
    const baseFare = 50; // Base fare in currency
    const distanceFare = estimatedDistance * selectedVehicle.rate;
    const subTotal = baseFare + distanceFare;
    const tax = subTotal * 0.15; // 15% tax
    const totalFare = subTotal + tax;
    setBill({
      vehicleName: selectedVehicle.name || selectedVehicle.model,
      vehicleType: selectedVehicle.type,
      estimatedDistance,
      baseFare,
      rate: selectedVehicle.rate,
      distanceFare,
      subTotal,
      tax,
      totalFare,
      pickup: formData.pickup_location,
      destination: formData.destination,
      scheduledTime: `${formData.scheduled_date} ${formData.scheduled_time}`
    });
    setShowBill(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!showBill) {
      calculateBill();
      return;
    }
   
    try {
      // Format date and time for backend
      const combinedDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`;
     
      // Use the BookingService instead of direct fetch
      if (apiServices.BookingService && apiServices.BookingService.createBooking) {
        const response = await apiServices.BookingService.createBooking({
          pickup_location: formData.pickup_location,
          destination: formData.destination,
          scheduled_datetime: combinedDateTime,
          vehicle_id: formData.vehicle_id,
          amount: bill.totalFare,
          notes: formData.notes || ''
        });
        
        if (response && response.status === 200) {
          setBookingSuccess(true);
          setTimeout(() => {
            navigate('/customer/bookings');
          }, 2000);
        } else {
          throw new Error('Booking creation failed');
        }
      } else {
        // Fallback to direct fetch if service not available
        const response = await fetch('/api/bookings/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            pickup_location: formData.pickup_location,
            destination: formData.destination,
            scheduled_datetime: combinedDateTime,
            vehicle_id: formData.vehicle_id,
            amount: bill.totalFare,
            notes: formData.notes
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create booking');
        }
        
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/customer/bookings');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: 'Failed to create booking. Please try again.' });
      
      // For development or demo environments, simulate success
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEMO_MODE === 'true') {
        console.log('Development mode: Simulating successful booking');
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/customer/bookings');
        }, 2000);
      }
    }
  };
  
  const goBackToForm = () => {
    setShowBill(false);
  };
  
  if (bookingSuccess) {
    return (
      <div className="booking-success">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Booking Successful!</h2>
          <p>Your ride has been scheduled successfully.</p>
          <p>Driver will be assigned shortly.</p>
          <p>Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }
  
  if (showBill) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <h2>Your Ride Details</h2>
          <div className="bill-container">
            <div className="bill-header">
              <h3>Trip Summary</h3>
              <p>Please confirm your booking details below</p>
            </div>
           
            <div className="bill-details">
              <div className="bill-row">
                <span>Vehicle Type:</span>
                <span>{bill.vehicleName} ({bill.vehicleType})</span>
              </div>
              <div className="bill-row">
                <span>Pickup Location:</span>
                <span>{bill.pickup}</span>
              </div>
              <div className="bill-row">
                <span>Destination:</span>
                <span>{bill.destination}</span>
              </div>
              <div className="bill-row">
                <span>Scheduled Time:</span>
                <span>{bill.scheduledTime}</span>
              </div>
              <div className="bill-row">
                <span>Estimated Distance:</span>
                <span>{bill.estimatedDistance} km</span>
              </div>
             
              <div className="bill-divider"></div>
             
              <div className="bill-row">
                <span>Base Fare:</span>
                <span>${bill.baseFare.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Distance Fare:</span>
                <span>${bill.distanceFare.toFixed(2)} (${bill.rate}/km × {bill.estimatedDistance} km)</span>
              </div>
              <div className="bill-row">
                <span>Subtotal:</span>
                <span>${bill.subTotal.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Tax (15%):</span>
                <span>${bill.tax.toFixed(2)}</span>
              </div>
             
              <div className="bill-total">
                <span>Total Fare:</span>
                <span>${bill.totalFare.toFixed(2)}</span>
              </div>
             
              <div className="bill-note">
                <p>* Final fare may vary slightly based on actual trip distance</p>
                <p>* Payment will be collected after the ride is completed</p>
              </div>
            </div>
           
            <div className="bill-actions">
              <button onClick={goBackToForm} className="back-btn">Go Back</button>
              <button onClick={handleSubmit} className="confirm-btn">Confirm Booking</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="booking-page">
      <div className="booking-container">
        <h2>Schedule a Ride</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="pickup_location">Pickup Location</label>
            <input
              type="text"
              id="pickup_location"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="Enter pickup address"
              className={errors.pickup_location ? 'error' : ''}
            />
            {errors.pickup_location && <span className="error-message">{errors.pickup_location}</span>}
          </div>
         
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination address"
              className={errors.destination ? 'error' : ''}
            />
            {errors.destination && <span className="error-message">{errors.destination}</span>}
          </div>
         
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="scheduled_date">Date</label>
              <input
                type="date"
                id="scheduled_date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={errors.scheduled_date ? 'error' : ''}
              />
              {errors.scheduled_date && <span className="error-message">{errors.scheduled_date}</span>}
            </div>
           
            <div className="form-group half">
              <label htmlFor="scheduled_time">Time</label>
              <input
                type="time"
                id="scheduled_time"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleChange}
                className={errors.scheduled_time ? 'error' : ''}
              />
              {errors.scheduled_time && <span className="error-message">{errors.scheduled_time}</span>}
            </div>
          </div>
         
          <div className="form-group">
            <label htmlFor="vehicle_id">Select Vehicle Type</label>
            {loading ? (
              <div className="loading-vehicles">Loading available vehicles...</div>
            ) : checkingAvailability ? (
              <div className="loading-vehicles">Checking vehicle availability...</div>
            ) : formData.scheduled_date && formData.scheduled_time ? (
                <select
                  id="vehicle_id"
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleChange}
                  className={errors.vehicle_id ? 'error' : ''}
                >
                  <option value="">-- Select a vehicle type --</option>
                  {vehicleTypes.map((type, index) => (
                    <option key={index} value={index + 1}>{type}</option>
                  ))}
                </select>
              ) : (
                <div className="select-datetime-prompt">
                  Please select a date and time to see available vehicles.
                </div>
              )}
              {errors.vehicle_id && <span className="error-message">{errors.vehicle_id}</span>}
            </div>
           
            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions for your ride"
                rows="3"
              ></textarea>
            </div>
            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
           
            <button
              type="submit"
              className="booking-submit-btn"
              disabled={loading || checkingAvailability || (formData.scheduled_date && formData.scheduled_time && availableVehicles.length === 0)}
            >
              Get Fare Estimate
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default BookingPage;