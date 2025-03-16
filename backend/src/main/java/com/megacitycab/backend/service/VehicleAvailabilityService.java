package com.megacitycab.backend.service;

import com.megacitycab.backend.model.Booking;
import com.megacitycab.backend.model.Vehicle;
import com.megacitycab.backend.repository.BookingRepository;
import com.megacitycab.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VehicleAvailabilityService {

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public VehicleAvailabilityService(
            VehicleRepository vehicleRepository,
            BookingRepository bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Vehicle> getAvailableVehiclesForDateTime(LocalDateTime dateTime) {

        List<Vehicle> allAvailableVehicles = vehicleRepository.findByStatus(Vehicle.VehicleStatus.AVAILABLE);

        if (allAvailableVehicles.isEmpty()) {
            return new ArrayList<>();
        }


        LocalDateTime startWindow = dateTime.minusHours(2);
        LocalDateTime endWindow = dateTime.plusHours(2);


        List<Booking> conflictingBookings = findConflictingBookings(startWindow, endWindow);

        if (conflictingBookings.isEmpty()) {

            return allAvailableVehicles;
        }


        Set<Integer> bookedVehicleIds = conflictingBookings.stream()
                .map(Booking::getVehicleId)
                .collect(Collectors.toSet());


        return allAvailableVehicles.stream()
                .filter(vehicle -> !bookedVehicleIds.contains(vehicle.getId()))
                .collect(Collectors.toList());
    }

    private List<Booking> findConflictingBookings(LocalDateTime startWindow, LocalDateTime endWindow) {
        // Find bookings with status CONFIRMED or PENDING that overlap with the time window
        return bookingRepository.findAll().stream()
                .filter(booking ->
                        (booking.getStatus() == Booking.BookingStatus.CONFIRMED ||
                                booking.getStatus() == Booking.BookingStatus.PENDING) &&
                                booking.getVehicleId() != null &&
                                isTimeOverlap(booking.getScheduledDatetime(), startWindow, endWindow))
                .collect(Collectors.toList());
    }

    private boolean isTimeOverlap(LocalDateTime bookingTime, LocalDateTime startWindow, LocalDateTime endWindow) {

        LocalDateTime bookingEndTime = bookingTime.plusHours(2);

        return (bookingTime.isAfter(startWindow) && bookingTime.isBefore(endWindow)) ||
                (bookingEndTime.isAfter(startWindow) && bookingEndTime.isBefore(endWindow)) ||
                (bookingTime.isBefore(startWindow) && bookingEndTime.isAfter(endWindow));
    }
}