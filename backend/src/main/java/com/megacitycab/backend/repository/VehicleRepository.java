package com.megacitycab.backend.repository;

import com.megacitycab.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    List<Vehicle> findByStatus(Vehicle.VehicleStatus status);
    List<Vehicle> findByDriverId(Integer driverId);
    boolean existsByPlateNumber(String plateNumber);
}