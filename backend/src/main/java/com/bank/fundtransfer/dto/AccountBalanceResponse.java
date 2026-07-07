package com.bank.fundtransfer.dto;

import java.math.BigDecimal;

public record AccountBalanceResponse(Long accountId, String accountNumber, BigDecimal balance) {
}
