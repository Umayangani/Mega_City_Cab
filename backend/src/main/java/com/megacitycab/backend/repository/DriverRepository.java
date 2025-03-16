package com.megacitycab.backend.repository;

import com.megacitycab.backend.model.Driver;
import com.megacitycab.backend.model.Driver.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {

    boolean existsByLicenseNumber(String licenseNumber);


    Optional<Driver> findByUserId(String userId);


    Optional<Driver> findByLicenseNumber(String licenseNumber);


    Optional<Driver> findByPhoneNumber(String phoneNumber);


    List<Driver> findByStatus(DriverStatus status);


    @Query("SELECT d FROM Driver d WHERE d.status = 'AVAILABLE' ORDER BY d.rating DESC")
    List<Driver> findAvailableDrivers();


    @Query("SELECT d FROM Driver d WHERE LOWER(CONCAT(d.firstName, ' ', d.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Driver> searchByName(@Param("name") String name);


    @Query("SELECT d FROM Driver d WHERE d.totalRatings > 0 ORDER BY d.rating DESC")
    List<Driver> findTopRatedDrivers();


    @Query("SELECT d FROM Driver d WHERE d.licenseExpiry < :expiryDate")
    List<Driver> findDriversWithExpiringLicense(@Param("expiryDate") String expiryDate);
}