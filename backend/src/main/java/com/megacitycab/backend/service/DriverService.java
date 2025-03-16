package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.DriverDTO;
import com.megacitycab.backend.model.Driver;
import com.megacitycab.backend.model.Driver.DriverStatus;
import com.megacitycab.backend.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    @Autowired
    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // Get all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // Get driver by ID
    public Optional<Driver> getDriverById(Integer id) {
        return driverRepository.findById(id);
    }

    // Get driver by user ID
    public Optional<Driver> getDriverByUserId(Integer userId) {
        return driverRepository.findByUserId(String.valueOf(userId));
    }

    // Create new driver
    @Transactional
    public Driver createDriver(DriverDTO driverDTO) {
        Driver driver = new Driver();
        driver.setUserId(driverDTO.getUserId().toString());
        driver.setFirstName(driverDTO.getFirstName());
        driver.setLastName(driverDTO.getLastName());
        driver.setPhoneNumber(driverDTO.getPhoneNumber());
        driver.setLicenseNumber(driverDTO.getLicenseNumber());
        driver.setLicenseExpiry(driverDTO.getLicenseExpiry());
        driver.setStatus(DriverStatus.AVAILABLE);

        return driverRepository.save(driver);
    }


    @Transactional
    public Driver updateDriver(Integer id, DriverDTO driverDTO) {
        Optional<Driver> optionalDriver = driverRepository.findById(id);

        if (optionalDriver.isEmpty()) {
            throw new RuntimeException("Driver not found with id: " + id);
        }

        Driver driver = optionalDriver.get();

        if (driverDTO.getFirstName() != null) {
            driver.setFirstName(driverDTO.getFirstName());
        }

        if (driverDTO.getLastName() != null) {
            driver.setLastName(driverDTO.getLastName());
        }

        if (driverDTO.getPhoneNumber() != null) {
            driver.setPhoneNumber(driverDTO.getPhoneNumber());
        }

        if (driverDTO.getLicenseNumber() != null) {
            driver.setLicenseNumber(driverDTO.getLicenseNumber());
        }

        if (driverDTO.getLicenseExpiry() != null) {
            driver.setLicenseExpiry(driverDTO.getLicenseExpiry());
        }

        if (driverDTO.getStatus() != null) {
            driver.setStatus(driverDTO.getStatus());
        }

        return driverRepository.save(driver);
    }


    @Transactional
    public Driver updateDriverStatus(Integer id, DriverStatus status) {
        Optional<Driver> optionalDriver = driverRepository.findById(id);

        if (optionalDriver.isEmpty()) {
            throw new RuntimeException("Driver not found with id: " + id);
        }

        Driver driver = optionalDriver.get();
        driver.setStatus(status);

        return driverRepository.save(driver);
    }


    @Transactional
    public Driver rateDriver(Integer id, Double rating) {
        if (rating < 1.0 || rating > 5.0) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Optional<Driver> optionalDriver = driverRepository.findById(id);

        if (optionalDriver.isEmpty()) {
            throw new RuntimeException("Driver not found with id: " + id);
        }

        Driver driver = optionalDriver.get();

        // Calculate new average rating
        double currentTotalRating = driver.getRating() * driver.getTotalRatings();
        int newTotalRatings = driver.getTotalRatings() + 1;
        double newAverageRating = (currentTotalRating + rating) / newTotalRatings;

        // Update driver rating
        driver.setRating(newAverageRating);
        driver.setTotalRatings(newTotalRatings);

        return driverRepository.save(driver);
    }


    @Transactional
    public void deleteDriver(Integer id) {
        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Driver not found with id: " + id);
        }

        driverRepository.deleteById(id);
    }


    public List<Driver> getAvailableDrivers() {
        return driverRepository.findAvailableDrivers();
    }


    public List<Driver> searchDriversByName(String name) {
        return driverRepository.searchByName(name);
    }


    public List<Driver> getTopRatedDrivers() {
        return driverRepository.findTopRatedDrivers();
    }




    public DriverDTO convertToDTO(Driver driver) {
        DriverDTO driverDTO = new DriverDTO();
        driverDTO.setId(driver.getId());
        driverDTO.setUserId(Integer.valueOf(driver.getUserId()));
        driverDTO.setFirstName(driver.getFirstName());
        driverDTO.setLastName(driver.getLastName());
        driverDTO.setPhoneNumber(driver.getPhoneNumber());
        driverDTO.setLicenseNumber(driver.getLicenseNumber());
        driverDTO.setLicenseExpiry(driver.getLicenseExpiry());
        driverDTO.setRating(driver.getRating());
        driverDTO.setTotalRatings(driver.getTotalRatings());
        driverDTO.setStatus(driver.getStatus());
        driverDTO.setFullName(driver.getFullName());

        return driverDTO;
    }
}