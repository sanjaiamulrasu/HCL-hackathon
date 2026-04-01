package com.hcl.hotelbooking.repository;

import com.hcl.hotelbooking.entity.Room;
import com.hcl.hotelbooking.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.id NOT IN " +
           "(SELECT b.room.id FROM Booking b WHERE b.status != 'CANCELLED' AND " +
           "(b.checkInDate < :checkOut AND b.checkOutDate > :checkIn))")
    List<Room> findAvailableRoomsByHotelAndDates(
            @Param("hotelId") Long hotelId, 
            @Param("checkIn") LocalDate checkIn, 
            @Param("checkOut") LocalDate checkOut);
            
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.type = :type AND r.id NOT IN " +
           "(SELECT b.room.id FROM Booking b WHERE b.status != 'CANCELLED' AND " +
           "(b.checkInDate < :checkOut AND b.checkOutDate > :checkIn))")
    List<Room> findAvailableRoomsByHotelTypeAndDates(
            @Param("hotelId") Long hotelId, 
            @Param("type") RoomType type,
            @Param("checkIn") LocalDate checkIn, 
            @Param("checkOut") LocalDate checkOut);
}
