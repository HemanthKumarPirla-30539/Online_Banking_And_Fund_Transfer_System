package com.bank.fundtransfer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BeneficiaryRequest(
        @NotNull(message = "Account ID is required")
        Long accountId,
        @NotBlank(message = "Beneficiary name is required")
        String beneficiaryName,
        @NotBlank(message = "Beneficiary account number is required")
        String beneficiaryAccountNumber,
        @NotBlank(message = "Bank name is required")
        String bankName,
        @NotBlank(message = "IFSC code is required")
        String ifsc
) {
}
