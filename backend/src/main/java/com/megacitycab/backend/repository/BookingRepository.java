package com.megacitycab.backend.repository;

import com.megacitycab.backend.model.Booking;
import com.megacitycab.backend.model.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {


    List<Booking> findByCustomerId(Integer customerId);


    List<Booking> findByDriverId(Integer driverId);


    List<Booking> findByStatus(BookingStatus status);


    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.driverId IS NULL ORDER BY b.scheduledDatetime ASC")
    List<Booking> findAllPendingBookings();


    List<Booking> findByDriverIdAndStatus(Integer driverId, BookingStatus status);


    List<Booking> findByCustomerIdAndStatus(Integer customerId, BookingStatus status);


    @Query("SELECT b FROM Booking b WHERE b.driverId = :driverId AND b.status = 'CONFIRMED' AND b.scheduledDatetime > :now ORDER BY b.scheduledDatetime ASC")
    List<Booking> findUpcomingBookingsByDriver(@Param("driverId") Integer driverId, @Param("now") LocalDateTime now);


    @Query("SELECT b FROM Booking b WHERE b.customerId = :customerId AND (b.status = 'PENDING' OR b.status = 'CONFIRMED') AND b.scheduledDatetime > :now ORDER BY b.scheduledDatetime ASC")
    List<Booking> findUpcomingBookingsByCustomer(@Param("customerId") Integer customerId, @Param("now") LocalDateTime now);


    @Query("SELECT b FROM Booking b WHERE b.driverId = :driverId AND b.status = 'COMPLETED' ORDER BY b.completionTime DESC")
    List<Booking> findCompletedBookingsByDriver(@Param("driverId") Integer driverId);


    @Query("SELECT b FROM Booking b WHERE b.customerId = :customerId AND b.status = 'COMPLETED' ORDER BY b.completionTime DESC")
    List<Booking> findCompletedBookingsByCustomer(@Param("customerId") Integer customerId);


    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.driverId IS NULL AND b.scheduledDatetime BETWEEN :start AND :end ORDER BY b.scheduledDatetime ASC")
    List<Booking> findBookingsNeedingDrivers(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}