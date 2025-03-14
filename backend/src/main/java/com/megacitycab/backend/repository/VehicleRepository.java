package com.megacitycab.backend.repository;

import com.megacitycab.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    boolean existsByPlateNumber(String plateNumber);

    // Find a vehicle by plate number
    Optional<Vehicle> findByPlateNumber(String plateNumber);

    // Add this new method for finding vehicles by type
    List<Vehicle> findByType(Vehicle.VehicleType type);

    // Add methods for new search functionality
    List<Vehicle> findByDriverId(Integer driverId);

    // Find by plate number containing the given string (case insensitive)
    List<Vehicle> findByPlateNumberContainingIgnoreCase(String plateNumber);
}