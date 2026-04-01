package com.hcl.hotelbooking.service.impl;

import com.hcl.hotelbooking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP for Hotel Booking Registration");
        message.setText("Your OTP is: " + otp + ". It is valid for 5 minutes.");
        mailSender.send(message);
    }

    @Override
    public void sendBookingConfirmation(String to, Long bookingId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Booking Confirmed");
        message.setText("Your booking (ID: " + bookingId + ") has been confirmed.");
        mailSender.send(message);
    }

    @Override
    public void sendCancellationEmail(String to, Long bookingId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Booking Cancelled");
        message.setText("Your booking (ID: " + bookingId + ") has been cancelled.");
        mailSender.send(message);
    }

    @Override
    public void sendPaymentReceipt(String to, Long bookingId, Double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Payment Receipt");
        message.setText("Payment of $" + amount + " for booking ID " + bookingId + " has been received successfully.");
        mailSender.send(message);
    }

    @Override
    public void sendBookingOtpEmail(String to, String otp, Long bookingId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reservation Verification Code - Booking #" + bookingId);
        message.setText("To complete your reservation of Booking #" + bookingId + ", please enter this verification code: " + otp + "\n\nThis security code is required to finalize your request.");
        mailSender.send(message);
    }
}
