package com.hcl.hotelbooking.service;

import com.hcl.hotelbooking.dto.AuthRequest;
import com.hcl.hotelbooking.dto.RegisterRequest;
import com.hcl.hotelbooking.dto.VerifyOtpRequest;

public interface AuthService {
    String register(RegisterRequest request);
    String verifyOtp(VerifyOtpRequest request);
    String login(AuthRequest request);
}
