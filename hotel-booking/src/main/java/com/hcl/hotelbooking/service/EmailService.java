package com.hcl.hotelbooking.service;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
    void sendBookingConfirmation(String to, Long bookingId);
    void sendCancellationEmail(String to, Long bookingId);
    void sendPaymentReceipt(String to, Long bookingId, Double amount);
}
