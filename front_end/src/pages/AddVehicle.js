import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Update with your backend URL

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    driverId: "", 
    model: "",
    plateNumber: "",
    type: "", // Changed from vehicleType to match backend field name
    status: "AVAILABLE",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [drivers, setDrivers] = useState([]);

  // Fetch drivers list when component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Assuming you have an endpoint to fetch drivers
        const response = await axios.get(`${API_BASE_URL}/drivers`);
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        // If you don't have a drivers endpoint yet, you can remove this code
      }
    };

    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Make API call to backend
      const response = await axios.post(`${API_BASE_URL}/vehicles`, vehicleData);
      
      console.log("Vehicle Added:", response.data);
      setMessage({ 
        text: "Vehicle added successfully!", 
        type: "success" 
      });
      
      // Reset form
      setVehicleData({
        driverId: "",
        model: "",
        plateNumber: "",
        type: "",
        status: "AVAILABLE",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      
      // Display error message
      setMessage({
        text: error.response?.data || "Failed to add vehicle. Please try again.",
        type: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Add Vehicle</h2>
      
      {/* Display success or error message */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Driver Selection */}
        <div className="mb-3">
          <label htmlFor="driverId" className="form-label">
            Driver
          </label>
          {drivers.length > 0 ? (
            <select
              className="form-control"
              id="driverId"
              name="driverId"
              value={vehicleData.driverId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.licenseNumber}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              className="form-control"
              id="driverId"
              name="driverId"
              value={vehicleData.driverId}
              onChange={handleInputChange}
              placeholder="Enter driver ID"
              required
            />
          )}
        </div>

        {/* Model Input */}
        <div className="mb-3">
          <label htmlFor="model" className="form-label">
            Model
          </label>
          <input
            type="text"
            className="form-control"
            id="model"
            name="model"
            value={vehicleData.model}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Plate Number Input */}
        <div className="mb-3">
          <label htmlFor="plateNumber" className="form-label">
            Plate Number
          </label>
          <input
            type="text"
            className="form-control"
            id="plateNumber"
            name="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Vehicle Type Selection */}
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Vehicle Type
          </label>
          <select
            className="form-control"
            id="type"
            name="type"
            value={vehicleData.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Vehicle Type</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        {/* Status Selection */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={vehicleData.status}
            onChange={handleInputChange}
            required
          >
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
            <option value="IN_REPAIR">In Repair</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;