import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditVehicle.css";

const API_BASE_URL = "http://localhost:8080/api/vehicles";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehicleData, setVehicleData] = useState({
    driverId: "",
    model: "",
    plateNumber: "",
    type: "",
    status: "AVAILABLE"
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch vehicle data on component mount
  useEffect(() => {
    if (!id) {
      setError("No vehicle ID provided");
      setLoading(false);
      return;
    }
    
    console.log("Fetching vehicle with ID:", id);
    setLoading(true);
    
    axios.get(`${API_BASE_URL}/${id}`)
      .then(response => {
        console.log("Vehicle data loaded:", response.data);
        setVehicleData(response.data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching vehicle:", err);
        let errorMessage = "Failed to load vehicle data.";
        
        if (err.response) {
          errorMessage += ` Server responded with status ${err.response.status}.`;
        } else if (err.request) {
          errorMessage += " No response received from server.";
        } else {
          errorMessage += ` ${err.message}`;
        }
        
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Convert driverId to number if provided
    const updateData = {
      ...vehicleData,
      driverId: vehicleData.driverId ? parseInt(vehicleData.driverId, 10) : null
    };
    
    console.log("Sending update request with data:", updateData);
    setLoading(true);
    
    axios.put(`${API_BASE_URL}/${id}`, updateData)
      .then(response => {
        console.log("Vehicle updated successfully:", response.data);
        setSuccess(true);
        
        // Navigate back to vehicle list after 2 seconds
        setTimeout(() => {
          navigate("/ViewVehicles");
        }, 2000);
      })
      .catch(err => {
        console.error("Error updating vehicle:", err);
        let errorMessage = "Failed to update vehicle.";
        
        if (err.response) {
          errorMessage += ` Server responded with status ${err.response.status}: ${err.response.data}`;
        } else if (err.request) {
          errorMessage += " No response received from server.";
        } else {
          errorMessage += ` ${err.message}`;
        }
        
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    navigate("/ViewVehicles");
  };

  if (loading && !vehicleData.id) {
    return (
      <div className="edit-vehicle-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-vehicle-container">
      <div className="edit-vehicle-card">
        <h2>Edit Vehicle</h2>
        
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️ </span>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <span>Vehicle updated successfully! Redirecting...</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="driverId">Driver ID</label>
            <input
              type="number"
              id="driverId"
              name="driverId"
              className="form-control"
              value={vehicleData.driverId || ""}
              onChange={handleInputChange}
              placeholder="Enter driver ID (optional)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model <span className="required">*</span></label>
            <input
              type="text"
              id="model"
              name="model"
              className="form-control"
              value={vehicleData.model || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter vehicle model"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="plateNumber">Plate Number <span className="required">*</span></label>
            <input
              type="text"
              id="plateNumber"
              name="plateNumber"
              className="form-control"
              value={vehicleData.plateNumber || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter plate number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Vehicle Type <span className="required">*</span></label>
            <select
              id="type"
              name="type"
              className="form-control"
              value={vehicleData.type || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Hatchback">Budget Car (Hatchback)</option>
              <option value="Sedan">Standard Car (Sedan)</option>
              <option value="SUV">Jeep (SUV)</option>
              <option value="Van">Van</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status <span className="required">*</span></label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={vehicleData.status || "AVAILABLE"}
              onChange={handleInputChange}
              required
            >
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
              <option value="IN_REPAIR">In Repair</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;