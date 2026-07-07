package com.bank.fundtransfer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        String senderAccount,
        String receiverAccount,
        BigDecimal amount,
        LocalDateTime date,
        String status,
        String remarks
) {
}
