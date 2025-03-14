package com.megacitycab.backend.controller;

import com.megacitycab.backend.dto.VehicleDTO;
import com.megacitycab.backend.model.Vehicle;
import com.megacitycab.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // Existing methods...

    @GetMapping
    public ResponseEntity<?> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while retrieving vehicles: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/by-type")
    public ResponseEntity<?> getVehiclesByType() {
        try {
            List<Vehicle> allVehicles = vehicleService.getAllVehicles();

            // Group vehicles by type
            Map<Vehicle.VehicleType, List<Vehicle>> vehiclesByType = allVehicles.stream()
                    .collect(Collectors.groupingBy(Vehicle::getType));

            return new ResponseEntity<>(vehiclesByType, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while retrieving vehicles by type: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchVehicles(
            @RequestParam(required = false) String plateNumber,
            @RequestParam(required = false) Integer driverId) {

        try {
            List<Vehicle> results = vehicleService.searchVehicles(plateNumber, driverId);
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while searching vehicles: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Integer id, @RequestBody VehicleDTO vehicleDTO) {
        try {
            // First check if the vehicle exists
            if (!vehicleService.existsById(id)) {
                return new ResponseEntity<>("Vehicle not found with id: " + id, HttpStatus.NOT_FOUND);
            }

            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicleDTO);
            return new ResponseEntity<>(updatedVehicle, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update vehicle: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // This endpoint should already exist in your VehicleController.java
// If not, you can add it to handle delete requests

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Integer id) {
        try {
            // First check if the vehicle exists
            if (!vehicleService.existsById(id)) {
                return new ResponseEntity<>("Vehicle not found with id: " + id,
                        HttpStatus.NOT_FOUND);
            }

            vehicleService.deleteVehicle(id);
            return new ResponseEntity<>("Vehicle deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete vehicle: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add other existing methods...
}