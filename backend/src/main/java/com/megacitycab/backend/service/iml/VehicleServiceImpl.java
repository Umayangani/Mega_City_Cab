package com.megacitycab.backend.service.iml;

import com.megacitycab.backend.dto.VehicleDTO;
import com.megacitycab.backend.exception.ResourceAlreadyExistsException;
import com.megacitycab.backend.exception.ResourceNotFoundException;
import com.megacitycab.backend.model.Vehicle;
import com.megacitycab.backend.repository.VehicleRepository;
import com.megacitycab.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleDTO getVehicleById(Integer id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return convertToDTO(vehicle);
    }

    @Override
    public VehicleDTO addVehicle(VehicleDTO vehicleDTO) {
        // Check if vehicle with same plate number already exists
        if (vehicleRepository.existsByPlateNumber(vehicleDTO.getPlateNumber())) {
            throw new ResourceAlreadyExistsException("Vehicle with plate number " + vehicleDTO.getPlateNumber() + " already exists");
        }

        Vehicle vehicle = convertToEntity(vehicleDTO);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return convertToDTO(savedVehicle);
    }

    @Override
    public VehicleDTO updateVehicle(Integer id, VehicleDTO vehicleDTO) {
        // Check if vehicle exists
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        // Check if plate number is being changed and if it already exists for another vehicle
        if (!existingVehicle.getPlateNumber().equals(vehicleDTO.getPlateNumber()) &&
                vehicleRepository.existsByPlateNumber(vehicleDTO.getPlateNumber())) {
            throw new ResourceAlreadyExistsException("Vehicle with plate number " + vehicleDTO.getPlateNumber() + " already exists");
        }

        Vehicle vehicle = convertToEntity(vehicleDTO);
        vehicle.setId(id); // Ensure the ID is set
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return convertToDTO(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    @Override
    public List<VehicleDTO> getVehiclesByStatus(Vehicle.VehicleStatus status) {
        return vehicleRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleDTO> getVehiclesByDriverId(Integer driverId) {
        return vehicleRepository.findByDriverId(driverId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Vehicle> getAvailableVehiclesForDateTime(LocalDateTime datetime) {
        return List.of();
    }

    // Helper methods for DTO conversion
    private VehicleDTO convertToDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getId());
        dto.setDriverId(vehicle.getDriverId());
        dto.setModel(vehicle.getModel());
        dto.setPlateNumber(vehicle.getPlateNumber());
        dto.setType(vehicle.getType());
        dto.setStatus(vehicle.getStatus());
        return dto;
    }

    private Vehicle convertToEntity(VehicleDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(dto.getId());
        vehicle.setDriverId(dto.getDriverId());
        vehicle.setModel(dto.getModel());
        vehicle.setPlateNumber(dto.getPlateNumber());
        vehicle.setType(dto.getType());
        vehicle.setStatus(dto.getStatus());
        return vehicle;
    }
}