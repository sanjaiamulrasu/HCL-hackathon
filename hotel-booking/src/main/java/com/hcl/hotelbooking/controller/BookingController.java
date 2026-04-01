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

    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<?> verifyOtp(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String otp = request.get( "otp");
        boolean isVerified = bookingService.verifyBookingOtp(id, otp);
        if (isVerified) {
            return ResponseEntity.ok(Map.of("message", "Booking verified successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid OTP"));
        }
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
        boolean isPrivileged = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("HOTEL_MANAGER"));
        
        if (isPrivileged) {
            return ResponseEntity.ok(bookingService.getAllBookings());
        }
        return ResponseEntity.ok(bookingService.getUserBookings(authentication.getName()));
    }
}
