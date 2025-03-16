package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.VehicleDTO;
import com.megacitycab.backend.model.Vehicle;


import java.util.List;

public interface VehicleService {
    List<VehicleDTO> getAllVehicles();
    VehicleDTO getVehicleById(Integer id);
    VehicleDTO addVehicle(VehicleDTO vehicleDTO);
    VehicleDTO updateVehicle(Integer id, VehicleDTO vehicleDTO);
    void deleteVehicle(Integer id);
    List<VehicleDTO> getVehiclesByStatus(Vehicle.VehicleStatus status);
    List<VehicleDTO> getVehiclesByDriverId(Integer driverId);
}