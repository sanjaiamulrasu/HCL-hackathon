package com.hcl.hotelbooking.service;

import com.hcl.hotelbooking.dto.PaymentRequest;
import com.hcl.hotelbooking.entity.Payment;

public interface PaymentService {
    Payment processPayment(PaymentRequest request, String userEmail);
    Payment getPaymentByBookingId(Long bookingId);
}
