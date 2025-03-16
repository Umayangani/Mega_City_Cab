package com.megacitycab.backend.controller;

import com.megacitycab.backend.dto.DriverDTO;
import com.megacitycab.backend.model.Driver;
import com.megacitycab.backend.model.Driver.DriverStatus;
import com.megacitycab.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    @Autowired
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDrivers() {
        try {
            List<Driver> drivers = driverService.getAllDrivers();
            List<DriverDTO> driverDTOs = drivers.stream()
                    .map(driverService::convertToDTO)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(driverDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving drivers: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Integer id) {
        try {
            Optional<Driver> driver = driverService.getDriverById(id);

            if (driver.isPresent()) {
                DriverDTO driverDTO = driverService.convertToDTO(driver.get());
                return new ResponseEntity<>(driverDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Driver not found with id: " + id,
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving driver: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDriverByUserId(@PathVariable Integer userId) {
        try {
            Optional<Driver> driver = driverService.getDriverByUserId(userId);

            if (driver.isPresent()) {
                DriverDTO driverDTO = driverService.convertToDTO(driver.get());
                return new ResponseEntity<>(driverDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Driver not found with userId: " + userId,
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving driver: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createDriver(@RequestBody DriverDTO driverDTO) {
        try {
            Driver driver = driverService.createDriver(driverDTO);
            DriverDTO createdDriverDTO = driverService.convertToDTO(driver);

            return new ResponseEntity<>(createdDriverDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating driver: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Integer id, @RequestBody DriverDTO driverDTO) {
        try {
            Driver driver = driverService.updateDriver(id, driverDTO);
            DriverDTO updatedDriverDTO = driverService.convertToDTO(driver);

            return new ResponseEntity<>(updatedDriverDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating driver: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDriverStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");

            if (statusStr == null || statusStr.trim().isEmpty()) {
                return new ResponseEntity<>("Status is required", HttpStatus.BAD_REQUEST);
            }

            DriverStatus status;
            try {
                status = DriverStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>("Invalid status. Valid values are: " +
                        String.join(", ", DriverStatus.values().toString()),
                        HttpStatus.BAD_REQUEST);
            }

            Driver driver = driverService.updateDriverStatus(id, status);
            DriverDTO updatedDriverDTO = driverService.convertToDTO(driver);

            return new ResponseEntity<>(updatedDriverDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating driver status: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateDriver(
            @PathVariable Integer id,
            @RequestBody Map<String, Double> payload) {
        try {
            Double rating = payload.get("rating");

            if (rating == null) {
                return new ResponseEntity<>("Rating is required", HttpStatus.BAD_REQUEST);
            }

            if (rating < 1.0 || rating > 5.0) {
                return new ResponseEntity<>("Rating must be between 1 and 5",
                        HttpStatus.BAD_REQUEST);
            }

            Driver driver = driverService.rateDriver(id, rating);
            DriverDTO updatedDriverDTO = driverService.convertToDTO(driver);

            return new ResponseEntity<>(updatedDriverDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error rating driver: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Integer id) {
        try {
            driverService.deleteDriver(id);
            return new ResponseEntity<>("Driver deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting driver: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableDrivers() {
        try {
            List<Driver> drivers = driverService.getAvailableDrivers();
            List<DriverDTO> driverDTOs = drivers.stream()
                    .map(driverService::convertToDTO)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(driverDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving available drivers: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchDriversByName(@RequestParam String name) {
        try {
            List<Driver> drivers = driverService.searchDriversByName(name);
            List<DriverDTO> driverDTOs = drivers.stream()
                    .map(driverService::convertToDTO)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(driverDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error searching drivers: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedDrivers() {
        try {
            List<Driver> drivers = driverService.getTopRatedDrivers();
            List<DriverDTO> driverDTOs = drivers.stream()
                    .map(driverService::convertToDTO)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(driverDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving top-rated drivers: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}