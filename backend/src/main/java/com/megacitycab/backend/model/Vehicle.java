package com.megacitycab.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "driver_id")
    private Integer driverId;

    @Column(nullable = false)
    private String model;

    @Column(name = "plate_number", nullable = false)
    private String plateNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType type;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('AVAILABLE', 'UNAVAILABLE', 'IN_REPAIR') DEFAULT 'AVAILABLE'")
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    public enum VehicleType {
        Hatchback, Sedan, SUV, Van, Luxury
    }

    public enum VehicleStatus {
        AVAILABLE, UNAVAILABLE, IN_REPAIR
    }
}