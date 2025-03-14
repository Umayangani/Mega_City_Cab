import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditVehicle from "./EditVehicle";

const API_BASE_URL = "http://localhost:8080/api/vehicles";

const VehicleList = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  // Add states for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load vehicles on component mount
  const loadVehicles = () => {
    setLoading(true);
    console.log("Loading vehicles list...");
    axios.get(API_BASE_URL)
      .then(response => {
        console.log("Vehicles loaded successfully:", response.data);
        setVehicles(response.data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching vehicles:", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        setError("Failed to load vehicles. " + (err.response?.data || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleEditClick = (vehicleId) => {
    console.log("Edit button clicked for vehicle ID:", vehicleId);
    setSelectedVehicleId(vehicleId);
    setShowEditForm(true);
  };

  // Add new function for handling delete click
  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  // Add function to confirm deletion
  const confirmDelete = () => {
    if (!vehicleToDelete || !vehicleToDelete.id) {
      console.error('No valid vehicle selected for deletion');
      setShowDeleteModal(false);
      return;
    }
    
    setDeleteLoading(true);
    console.log(`Deleting vehicle with ID: ${vehicleToDelete.id}`);
    
    axios.delete(`${API_BASE_URL}/${vehicleToDelete.id}`)
      .then(response => {
        console.log("Vehicle deleted successfully:", response.data);
        // Remove the deleted vehicle from the state
        setVehicles(prevVehicles => 
          prevVehicles.filter(vehicle => vehicle.id !== vehicleToDelete.id)
        );
        setShowDeleteModal(false);
      })
      .catch(err => {
        console.error("Error deleting vehicle:", err);
        setError("Failed to delete vehicle. " + (err.response?.data || err.message));
      })
      .finally(() => {
        setDeleteLoading(false);
        setVehicleToDelete(null);
      });
  };

  // Add function to cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  const handleUpdateSuccess = (updatedVehicle) => {
    console.log("Vehicle updated successfully:", updatedVehicle);
    loadVehicles();
    setShowEditForm(false);
  };

  const handleBackToList = () => {
    setShowEditForm(false);
    setSelectedVehicleId(null);
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Vehicle Management</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button
            className="btn btn-outline-danger"
            onClick={() => loadVehicles()}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this vehicle?</p>
                {vehicleToDelete && (
                  <div>
                    <p><strong>ID:</strong> {vehicleToDelete.id}</p>
                    <p><strong>Model:</strong> {vehicleToDelete.model}</p>
                    <p><strong>Plate Number:</strong> {vehicleToDelete.plateNumber}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditForm && selectedVehicleId ? (
        <EditVehicle
          vehicleId={selectedVehicleId}
          onUpdateSuccess={handleUpdateSuccess}
          onBackToList={handleBackToList}
        />
      ) : (
        <div>
          <h3>Vehicle List</h3>
          {vehicles.length === 0 ? (
            <div className="alert alert-info">
              <p>No vehicles found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
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
                  {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.id}</td>
                      <td>{vehicle.driverId || 'N/A'}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.plateNumber}</td>
                      <td>{vehicle.type}</td>
                      <td>{vehicle.status}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditClick(vehicle.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(vehicle)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleList;