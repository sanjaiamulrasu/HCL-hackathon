package com.hcl.hotelbooking.service.impl;

import com.hcl.hotelbooking.dto.AuthRequest;
import com.hcl.hotelbooking.dto.RegisterRequest;
import com.hcl.hotelbooking.dto.VerifyOtpRequest;
import com.hcl.hotelbooking.entity.Role;
import com.hcl.hotelbooking.entity.User;
import com.hcl.hotelbooking.exception.BadRequestException;
import com.hcl.hotelbooking.exception.ResourceNotFoundException;
import com.hcl.hotelbooking.repository.UserRepository;
import com.hcl.hotelbooking.security.JwtUtil;
import com.hcl.hotelbooking.service.AuthService;
import com.hcl.hotelbooking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Override
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered!");
        }

        String otp = generateOtp();
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.USER)
                .otp(otp)
                .otpExpiry(System.currentTimeMillis() + 300000) // 5 minutes
                .isVerified(false)
                .build();

        userRepository.save(user);
        
        // Send OTP email
        emailService.sendOtpEmail(user.getEmail(), otp);

        return "Registration successful. Please verify, OTP sent to email.";
    }

    @Override
    public String verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("User is already verified");
        }

        if (user.getOtpExpiry() < System.currentTimeMillis()) {
            throw new BadRequestException("OTP has expired");
        }

        if (!user.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Email verified successfully. You can now login.";
    }

    @Override
    public String login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isVerified()) {
            throw new BadRequestException("Email is not verified");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        return jwtUtil.generateToken(user);
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
