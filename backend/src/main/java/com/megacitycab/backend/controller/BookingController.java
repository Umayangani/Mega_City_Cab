package com.megacitycab.backend.controller;

import com.megacitycab.backend.dto.BookingDTO;
import com.megacitycab.backend.model.Booking;
import com.megacitycab.backend.model.Booking.PaymentStatus;
import com.megacitycab.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            Booking booking = bookingService.createBooking(bookingDTO);
            return new ResponseEntity<>(booking, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        try {
            Optional<Booking> booking = bookingService.getBookingById(id);
            if (booking.isPresent()) {
                return new ResponseEntity<>(booking.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Booking not found with id: " + id,
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getBookingsByCustomer(@PathVariable Integer customerId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByCustomerId(customerId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer/{customerId}/upcoming")
    public ResponseEntity<?> getUpcomingBookingsByCustomer(@PathVariable Integer customerId) {
        try {
            List<Booking> bookings = bookingService.getUpcomingBookingsByCustomer(customerId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving upcoming bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer/{customerId}/completed")
    public ResponseEntity<?> getCompletedBookingsByCustomer(@PathVariable Integer customerId) {
        try {
            List<Booking> bookings = bookingService.getCompletedBookingsByCustomer(customerId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving completed bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getAllPendingBookings() {
        try {
            List<Booking> bookings = bookingService.getPendingBookings();
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving pending bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/driver/{driverId}/pending")
    public ResponseEntity<?> getPendingBookingsByDriver(@PathVariable Integer driverId) {
        try {
            List<Booking> bookings = bookingService.getPendingBookingsByDriver(driverId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving pending bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/driver/{driverId}/confirmed")
    public ResponseEntity<?> getConfirmedBookingsByDriver(@PathVariable Integer driverId) {
        try {
            List<Booking> bookings = bookingService.getConfirmedBookingsByDriver(driverId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving confirmed bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/driver/{driverId}/completed")
    public ResponseEntity<?> getCompletedBookingsByDriver(@PathVariable Integer driverId) {
        try {
            List<Booking> bookings = bookingService.getCompletedBookingsByDriver(driverId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving completed bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/driver/{driverId}/upcoming")
    public ResponseEntity<?> getUpcomingBookingsByDriver(@PathVariable Integer driverId) {
        try {
            List<Booking> bookings = bookingService.getUpcomingBookingsByDriver(driverId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving upcoming bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptBooking(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer driverId = payload.get("driver_id");
            if (driverId == null) {
                return new ResponseEntity<>("Driver ID is required", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.acceptBooking(id, driverId);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error accepting booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> payload) {
        try {
            Integer driverId = (Integer) payload.get("driver_id");
            String rejectionReason = (String) payload.get("rejection_reason");

            if (driverId == null) {
                return new ResponseEntity<>("Driver ID is required", HttpStatus.BAD_REQUEST);
            }

            if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
                return new ResponseEntity<>("Rejection reason is required", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.rejectBooking(id, driverId, rejectionReason);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error rejecting booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Integer id) {
        try {
            Booking booking = bookingService.completeBooking(id);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error completing booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error cancelling booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> payload) {
        try {
            String paymentStatus = payload.get("payment_status");

            if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
                return new ResponseEntity<>("Payment status is required", HttpStatus.BAD_REQUEST);
            }

            PaymentStatus status;
            try {
                status = PaymentStatus.valueOf(paymentStatus.toUpperCase());
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>("Invalid payment status. Must be PENDING or PAID",
                        HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.updateBookingPaymentStatus(id, status);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating payment status: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}