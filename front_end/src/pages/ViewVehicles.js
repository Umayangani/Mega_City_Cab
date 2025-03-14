import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewVehicles.css';

const API_BASE_URL = "http://localhost:8080/api/vehicles";

const ViewVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesByType, setVehiclesByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all vehicles data on component mount
  useEffect(() => {
    console.log("ViewVehicles component mounted");
    fetchVehicles();
  }, []);

  // Function to fetch all vehicles and organize them by type
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all vehicles
      const response = await axios.get(API_BASE_URL);
      console.log("All vehicles response:", response.data);
      
      // Store all vehicles
      const allVehicles = Array.isArray(response.data) ? response.data : [];
      setVehicles(allVehicles);
      
      // Group vehicles by type
      const grouped = allVehicles.reduce((acc, vehicle) => {
        const type = vehicle.type || 'Unknown';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(vehicle);
        return acc;
      }, {});
      
      setVehiclesByType(grouped);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError("Failed to fetch vehicles. Please check server connection.");
      setVehiclesByType({});
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (vehicleId) => {
    if (!vehicleId) {
      console.error('No vehicle ID provided for editing');
      setError('Cannot edit: Invalid vehicle ID');
      return;
    }
    
    console.log('Navigating to edit vehicle with ID:', vehicleId);
    // Explicitly navigate to the EditVehicle route with the vehicle ID
    navigate(`/EditVehicle/${vehicleId}`);
  };

  // Map for vehicle type display names
  const vehicleTypeLabels = {
    'Hatchback': 'BUDGET CAR',
    'Sedan': 'STANDARD CAR',
    'SUV': 'JEEP',
    'Van': 'VAN',
    'Luxury': 'LUXURY'
  };

  // Function to render vehicle table with Edit button
  const renderVehicleTable = (vehiclesList) => (
    <table className="vehicle-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Driver ID</th>
          <th>Model</th>
          <th>Plate Number</th>
          <th>Type</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {vehiclesList && vehiclesList.length > 0 ? (
          vehiclesList.map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.driverId || 'N/A'}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.plateNumber}</td>
              <td>{vehicle.type}</td>
              <td>{vehicle.status}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(vehicle.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="no-data">No vehicles found</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="vehicle-container">
      <h1>Vehicle Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading vehicles data...</div>
      ) : (
        // Display vehicles by type
        <div className="vehicle-type-sections">
          {Object.keys(vehicleTypeLabels).map(type => {
            const typeVehicles = vehiclesByType[type] || [];
            return (
              <div key={type} className="vehicle-section">
                <h2>{vehicleTypeLabels[type]}</h2>
                {renderVehicleTable(typeVehicles)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewVehicles;