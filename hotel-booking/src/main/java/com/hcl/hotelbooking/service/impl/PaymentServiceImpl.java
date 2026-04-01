package com.hcl.hotelbooking.service.impl;

import com.hcl.hotelbooking.dto.PaymentRequest;
import com.hcl.hotelbooking.entity.Booking;
import com.hcl.hotelbooking.entity.BookingStatus;
import com.hcl.hotelbooking.entity.Payment;
import com.hcl.hotelbooking.entity.PaymentMethod;
import com.hcl.hotelbooking.entity.PaymentStatus;
import com.hcl.hotelbooking.exception.BookingException;
import com.hcl.hotelbooking.exception.ResourceNotFoundException;
import com.hcl.hotelbooking.repository.BookingRepository;
import com.hcl.hotelbooking.repository.PaymentRepository;
import com.hcl.hotelbooking.service.EmailService;
import com.hcl.hotelbooking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public Payment processPayment(PaymentRequest request, String userEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BookingException("You are not authorized to pay for this booking");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new BookingException("Booking is already paid and confirmed");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Cannot pay for a cancelled booking");
        }

        // Simulate payment processing...
        String transactionId = request.getTransactionId() != null ? 
                request.getTransactionId() : UUID.randomUUID().toString();

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .status(PaymentStatus.SUCCESS)
                .method(PaymentMethod.valueOf(request.getMethod().toUpperCase()))
                .transactionId(transactionId)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        
        emailService.sendPaymentReceipt(userEmail, booking.getId(), payment.getAmount());

        return savedPayment;
    }

    @Override
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
