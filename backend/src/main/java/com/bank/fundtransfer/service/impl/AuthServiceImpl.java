package com.bank.fundtransfer.service.impl;

import com.bank.fundtransfer.dto.AuthRequest;
import com.bank.fundtransfer.dto.AuthResponse;
import com.bank.fundtransfer.dto.RegisterRequest;
import com.bank.fundtransfer.entity.Account;
import com.bank.fundtransfer.entity.User;
import com.bank.fundtransfer.exception.AccountNotFoundException;
import com.bank.fundtransfer.exception.UserNotFoundException;
import com.bank.fundtransfer.repository.AccountRepository;
import com.bank.fundtransfer.repository.UserRepository;
import com.bank.fundtransfer.security.JwtUtil;
import com.bank.fundtransfer.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           AccountRepository accountRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException ex) {
            throw new UserNotFoundException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("Invalid email or password"));

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found for user"));

        String token = jwtUtil.generateToken(request.email());
        return new AuthResponse(
                token,
                "Bearer",
                account.getId(),
                account.getAccountNumber(),
                user.getEmail(),
                user.getName(),
                user.getPhone()
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);

        Account account = Account.builder()
                .accountNumber(generateAccountNumber(savedUser.getId()))
                .balance(BigDecimal.ZERO)
                .user(savedUser)
                .build();

        Account savedAccount = accountRepository.save(account);
        String token = jwtUtil.generateToken(savedUser.getEmail());
        return new AuthResponse(
                token,
                "Bearer",
                savedAccount.getId(),
                savedAccount.getAccountNumber(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getPhone()
        );
    }

    private String generateAccountNumber(Long userId) {
        return "FTS" + System.currentTimeMillis() + userId;
    }
}
