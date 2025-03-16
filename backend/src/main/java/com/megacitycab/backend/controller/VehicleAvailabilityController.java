package com.megacitycab.backend.controller;

import com.megacitycab.backend.model.Vehicle;
import com.megacitycab.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleAvailabilityController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleAvailabilityController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableVehicles(
            @RequestParam("datetime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime datetime) {
        try {
            List<Vehicle> availableVehicles = vehicleService.getAvailableVehiclesForDateTime(datetime);
            return new ResponseEntity<>(availableVehicles, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving available vehicles: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}