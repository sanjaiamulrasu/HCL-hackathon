package com.hcl.hotelbooking.controller;

import com.hcl.hotelbooking.dto.AuthRequest;
import com.hcl.hotelbooking.dto.RegisterRequest;
import com.hcl.hotelbooking.dto.VerifyOtpRequest;
import com.hcl.hotelbooking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String msg = authService.register(request);
        return ResponseEntity.ok(Map.of("message", msg));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String msg = authService.verifyOtp(request);
        return ResponseEntity.ok(Map.of("message", msg));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
