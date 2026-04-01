package com.hcl.hotelbooking.service;

import com.hcl.hotelbooking.dto.BookingRequest;
import com.hcl.hotelbooking.entity.Booking;

import java.util.List;

public interface BookingService {
    Booking bookRoom(BookingRequest request, String userEmail);
    void cancelBooking(Long bookingId, String userEmail);
    Booking getBookingById(Long bookingId);
    List<Booking> getUserBookings(String userEmail);
}
