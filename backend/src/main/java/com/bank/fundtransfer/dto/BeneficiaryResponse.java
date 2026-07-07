package com.bank.fundtransfer.dto;

import java.time.LocalDateTime;

public record BeneficiaryResponse(
        Long id,
        String beneficiaryName,
        String beneficiaryAccountNumber,
        String bankName,
        String ifsc,
        LocalDateTime addedDate,
        Long accountId
) {
}
