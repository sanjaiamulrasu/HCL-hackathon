package com.hcl.hotelbooking.controller;

import com.hcl.hotelbooking.dto.RoomDto;
import com.hcl.hotelbooking.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<RoomDto> addRoom(@Valid @RequestBody RoomDto roomDto) {
        return new ResponseEntity<>(roomService.addRoom(roomDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<RoomDto> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomDto roomDto) {
        return ResponseEntity.ok(roomService.updateRoom(id, roomDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomDto>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(hotelId));
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomDto>> getAvailableRooms(
            @RequestParam Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(roomService.getAvailableRooms(hotelId, checkIn, checkOut));
    }
}
