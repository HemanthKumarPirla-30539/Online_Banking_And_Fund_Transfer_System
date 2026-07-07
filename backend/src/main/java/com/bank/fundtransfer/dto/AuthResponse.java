package com.bank.fundtransfer.dto;

public record AuthResponse(
        String token,
        String tokenType,
        Long accountId,
        String accountNumber,
        String email,
        String name,
        String phone
) {
}
