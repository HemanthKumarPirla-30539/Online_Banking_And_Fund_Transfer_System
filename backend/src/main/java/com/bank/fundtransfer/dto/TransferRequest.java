package com.bank.fundtransfer.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TransferRequest(
        @NotBlank(message = "Sender account number is required")
        String senderAccount,
        @NotBlank(message = "Receiver account number is required")
        String receiverAccount,
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be positive")
        BigDecimal amount,
        String remarks
) {
}
