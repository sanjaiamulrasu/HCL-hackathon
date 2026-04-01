package com.hcl.hotelbooking.service;

import com.hcl.hotelbooking.dto.RoomDto;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    RoomDto addRoom(RoomDto roomDto);
    RoomDto updateRoom(Long id, RoomDto roomDto);
    void deleteRoom(Long id);
    RoomDto getRoomById(Long id);
    List<RoomDto> getRoomsByHotel(Long hotelId);
    List<RoomDto> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut);
}
