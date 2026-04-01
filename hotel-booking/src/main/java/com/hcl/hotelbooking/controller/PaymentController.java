package com.hcl.hotelbooking.controller;

import com.hcl.hotelbooking.dto.PaymentRequest;
import com.hcl.hotelbooking.entity.Payment;
import com.hcl.hotelbooking.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> processPayment(@Valid @RequestBody PaymentRequest request, Authentication authentication) {
        Payment payment = paymentService.processPayment(request, authentication.getName());
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId));
    }
}
