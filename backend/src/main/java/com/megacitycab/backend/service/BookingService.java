package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.BookingDTO;
import com.megacitycab.backend.model.Booking;
import com.megacitycab.backend.model.Booking.BookingStatus;
import com.megacitycab.backend.repository.BookingRepository;
import com.megacitycab.backend.repository.CustomerRepository;
import com.megacitycab.backend.repository.DriverRepository;
import com.megacitycab.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public Booking createBooking(BookingDTO bookingDTO) {
        try {
            System.out.println("Creating booking with data: " + bookingDTO);

            Booking booking = new Booking();
            booking.setCustomerId(bookingDTO.getCustomerId());
            booking.setPickupLocation(bookingDTO.getPickupLocation());
            booking.setDestination(bookingDTO.getDestination());
            booking.setScheduledDatetime(bookingDTO.getScheduledDatetime());
            booking.setVehicleId(bookingDTO.getVehicleId());
            booking.setAmount(bookingDTO.getAmount());
            booking.setNotes(bookingDTO.getNotes());
            booking.setStatus(BookingStatus.PENDING);
            booking.setBookingTime(LocalDateTime.now());

            System.out.println("About to save booking: " + booking);
            Booking savedBooking = bookingRepository.save(booking);
            System.out.println("Booking saved successfully with ID: " + savedBooking.getId());
            return savedBooking;
        } catch (Exception e) {
            System.err.println("Error creating booking: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Optional<Booking> getBookingById(Integer id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByCustomerId(Integer customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getUpcomingBookingsByCustomer(Integer customerId) {
        return bookingRepository.findUpcomingBookingsByCustomer(customerId, LocalDateTime.now());
    }

    public List<Booking> getCompletedBookingsByCustomer(Integer customerId) {
        return bookingRepository.findCompletedBookingsByCustomer(customerId);
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findAllPendingBookings();
    }

    public List<Booking> getPendingBookingsByDriver(Integer driverId) {
        return bookingRepository.findByDriverIdAndStatus(driverId, BookingStatus.PENDING);
    }

    public List<Booking> getConfirmedBookingsByDriver(Integer driverId) {
        return bookingRepository.findByDriverIdAndStatus(driverId, BookingStatus.CONFIRMED);
    }

    public List<Booking> getCompletedBookingsByDriver(Integer driverId) {
        return bookingRepository.findCompletedBookingsByDriver(driverId);
    }

    public List<Booking> getUpcomingBookingsByDriver(Integer driverId) {
        return bookingRepository.findUpcomingBookingsByDriver(driverId, LocalDateTime.now());
    }

    @Transactional
    public Booking acceptBooking(Integer bookingId, Integer driverId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        Booking booking = optionalBooking.get();

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING state and cannot be accepted");
        }

        booking.setDriverId(driverId);
        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking rejectBooking(Integer bookingId, Integer driverId, String rejectionReason) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        Booking booking = optionalBooking.get();

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING state and cannot be rejected");
        }

        booking.setDriverId(driverId); // For tracking which driver rejected it
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason);
        booking.setRejectionTime(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking completeBooking(Integer bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        Booking booking = optionalBooking.get();

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Booking is not in CONFIRMED state and cannot be completed");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCompletionTime(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Integer bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        Booking booking = optionalBooking.get();

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Booking is already completed and cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingPaymentStatus(Integer bookingId, Booking.PaymentStatus paymentStatus) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        Booking booking = optionalBooking.get();
        booking.setPaymentStatus(paymentStatus);

        return bookingRepository.save(booking);
    }


}