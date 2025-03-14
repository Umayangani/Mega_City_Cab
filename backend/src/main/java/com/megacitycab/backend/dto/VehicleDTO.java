package com.megacitycab.backend.dto;

import com.megacitycab.backend.model.Vehicle.VehicleStatus;
import com.megacitycab.backend.model.Vehicle.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Integer id;
    private Integer driverId;
    private String model;
    private String plateNumber;
    private VehicleType type;
    private VehicleStatus status = VehicleStatus.AVAILABLE;
}