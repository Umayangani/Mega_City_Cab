package com.megacitycab.backend.dto;

import com.megacitycab.backend.model.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Integer id;
    private Integer driverId;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Plate number is required")
    private String plateNumber;

    @NotNull(message = "Vehicle type is required")
    private Vehicle.VehicleType type;

    private Vehicle.VehicleStatus status = Vehicle.VehicleStatus.AVAILABLE;
}
