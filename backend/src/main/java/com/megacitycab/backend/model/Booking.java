package com.megacitycab.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "driver_id")
    private Integer driverId;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "pickup_location", nullable = false)
    private String pickupLocation;

    @Column(name = "destination", nullable = false)
    private String destination;

    @Column(name = "scheduled_datetime")
    private LocalDateTime scheduledDatetime;

    @Column(name = "booking_time")
    private LocalDateTime bookingTime = LocalDateTime.now();

    @Column(name = "completion_time")
    private LocalDateTime completionTime;

    @Column(name = "rejection_time")
    private LocalDateTime rejectionTime;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "notes")
    private String notes;

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED
    }

    public enum PaymentStatus {
        PENDING, PAID
    }
}