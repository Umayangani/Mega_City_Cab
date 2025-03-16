package com.megacitycab.backend.dto;

import com.megacitycab.backend.model.Booking.BookingStatus;
import com.megacitycab.backend.model.Booking.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Integer id;
    private Integer customerId;
    private Integer driverId;
    private Integer vehicleId;
    private String pickupLocation;
    private String destination;
    private LocalDateTime scheduledDatetime;
    private LocalDateTime bookingTime;
    private LocalDateTime completionTime;
    private LocalDateTime rejectionTime;
    private String rejectionReason;
    private BookingStatus status = BookingStatus.PENDING;
    private BigDecimal amount;
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    private String notes;


    private CustomerDTO customer;
    private DriverDTO driver;
    private VehicleDTO vehicle;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class CustomerDTO {
    private Integer id;
    private String name;
    private Double rating;
    private String phoneNumber;
}

