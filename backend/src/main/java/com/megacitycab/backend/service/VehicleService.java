package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.VehicleDTO;
import com.megacitycab.backend.model.Vehicle;
import com.megacitycab.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle updateVehicle(Integer id, VehicleDTO vehicleDTO) {
        // Get the existing vehicle
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        // Update the fields
        vehicle.setDriverId(vehicleDTO.getDriverId());
        vehicle.setModel(vehicleDTO.getModel());
        vehicle.setPlateNumber(vehicleDTO.getPlateNumber());
        vehicle.setType(vehicleDTO.getType());
        vehicle.setStatus(vehicleDTO.getStatus());

        // Save and return
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return vehicleRepository.existsById(id);
    }

    // Keep existing methods

    // Add new methods for search and retrieval

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> searchVehicles(String plateNumber, Integer driverId) {
        List<Vehicle> allVehicles = vehicleRepository.findAll();

        // Filter by provided criteria
        return allVehicles.stream()
                .filter(vehicle -> {
                    boolean matches = true;

                    // Filter by plate number if provided
                    if (plateNumber != null && !plateNumber.isEmpty()) {
                        matches = matches && vehicle.getPlateNumber().toLowerCase()
                                .contains(plateNumber.toLowerCase());
                    }

                    // Filter by driver ID if provided
                    if (driverId != null) {
                        matches = matches && vehicle.getDriverId() != null
                                && vehicle.getDriverId().equals(driverId);
                    }

                    return matches;
                })
                .collect(Collectors.toList());
    }

    public List<Vehicle> getVehiclesByType(Vehicle.VehicleType type) {
        return vehicleRepository.findByType(type);
    }

    // Keep other existing methods...
}