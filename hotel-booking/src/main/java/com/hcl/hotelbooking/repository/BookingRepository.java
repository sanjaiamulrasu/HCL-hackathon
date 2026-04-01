package com.hcl.hotelbooking.repository;

import com.hcl.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.id = :roomId AND b.status != 'CANCELLED' " +
           "AND (b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    boolean existsConflictingBooking(
            @Param("roomId") Long roomId, 
            @Param("checkIn") LocalDate checkIn, 
            @Param("checkOut") LocalDate checkOut);
}
