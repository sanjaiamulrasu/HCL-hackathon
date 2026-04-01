package com.hcl.hotelbooking.controller;

import com.hcl.hotelbooking.dto.BookingRequest;
import com.hcl.hotelbooking.entity.Booking;
import com.hcl.hotelbooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> bookRoom(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        Booking booking = bookingService.bookRoom(request, authentication.getName());
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        bookingService.cancelBooking(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(authentication.getName()));
    }
}
