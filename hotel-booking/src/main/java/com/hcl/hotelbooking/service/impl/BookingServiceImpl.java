package com.hcl.hotelbooking.service.impl;

import com.hcl.hotelbooking.dto.BookingRequest;
import com.hcl.hotelbooking.entity.Booking;
import com.hcl.hotelbooking.entity.BookingStatus;
import com.hcl.hotelbooking.entity.Room;
import com.hcl.hotelbooking.entity.User;
import com.hcl.hotelbooking.exception.BookingException;
import com.hcl.hotelbooking.exception.ResourceNotFoundException;
import com.hcl.hotelbooking.repository.BookingRepository;
import com.hcl.hotelbooking.repository.RoomRepository;
import com.hcl.hotelbooking.repository.UserRepository;
import com.hcl.hotelbooking.service.BookingService;
import com.hcl.hotelbooking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public Booking bookRoom(BookingRequest request, String userEmail) {
        if (request.getCheckOutDate().isBefore(request.getCheckInDate()) || 
            request.getCheckOutDate().isEqual(request.getCheckInDate())) {
            throw new BookingException("Check-out date must be after check-in date");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Check availability
        boolean isConflict = bookingRepository.existsConflictingBooking(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());

        if (isConflict) {
            throw new BookingException("Room is not available for the selected dates");
        }

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        Double totalPrice = days * room.getPrice();

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        
        // Email sent after successful booking creation
        emailService.sendBookingConfirmation(user.getEmail(), savedBooking.getId());
        
        return savedBooking;
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BookingException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        emailService.sendCancellationEmail(userEmail, bookingId);
    }

    @Override
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    @Override
    public List<Booking> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }
}
