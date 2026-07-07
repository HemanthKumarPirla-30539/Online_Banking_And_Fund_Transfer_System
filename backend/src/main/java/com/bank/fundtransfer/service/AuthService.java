package com.bank.fundtransfer.service;

import com.bank.fundtransfer.dto.AuthRequest;
import com.bank.fundtransfer.dto.AuthResponse;
import com.bank.fundtransfer.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}
