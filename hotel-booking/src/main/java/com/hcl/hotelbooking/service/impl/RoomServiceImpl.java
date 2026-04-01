package com.hcl.hotelbooking.service.impl;

import com.hcl.hotelbooking.dto.RoomDto;
import com.hcl.hotelbooking.entity.Hotel;
import com.hcl.hotelbooking.entity.Room;
import com.hcl.hotelbooking.entity.RoomType;
import com.hcl.hotelbooking.exception.ResourceNotFoundException;
import com.hcl.hotelbooking.repository.HotelRepository;
import com.hcl.hotelbooking.repository.RoomRepository;
import com.hcl.hotelbooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    @Override
    public RoomDto addRoom(RoomDto roomDto) {
        Hotel hotel = hotelRepository.findById(roomDto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + roomDto.getHotelId()));

        Room room = Room.builder()
                .roomNumber(roomDto.getRoomNumber())
                .type(RoomType.valueOf(roomDto.getType().toUpperCase()))
                .price(roomDto.getPrice())
                .isAvailable(true)
                .hotel(hotel)
                .build();

        Room savedRoom = roomRepository.save(room);
        return mapToDto(savedRoom);
    }

    @Override
    public RoomDto updateRoom(Long id, RoomDto roomDto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        room.setRoomNumber(roomDto.getRoomNumber());
        room.setType(RoomType.valueOf(roomDto.getType().toUpperCase()));
        room.setPrice(roomDto.getPrice());
        room.setAvailable(roomDto.isAvailable());

        Room updatedRoom = roomRepository.save(room);
        return mapToDto(updatedRoom);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }

    @Override
    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return mapToDto(room);
    }

    @Override
    public List<RoomDto> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDto> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRoomsByHotelAndDates(hotelId, checkIn, checkOut).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private RoomDto mapToDto(Room entity) {
        RoomDto dto = new RoomDto();
        dto.setId(entity.getId());
        dto.setRoomNumber(entity.getRoomNumber());
        dto.setType(entity.getType().name());
        dto.setPrice(entity.getPrice());
        dto.setAvailable(entity.isAvailable());
        dto.setHotelId(entity.getHotel().getId());
        return dto;
    }
}
