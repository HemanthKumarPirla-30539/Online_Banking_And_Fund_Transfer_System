package com.bank.fundtransfer.service;

import com.bank.fundtransfer.dto.BeneficiaryRequest;
import com.bank.fundtransfer.dto.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {
    BeneficiaryResponse addBeneficiary(BeneficiaryRequest request);
    List<BeneficiaryResponse> getAllBeneficiaries(Long accountId);
    BeneficiaryResponse updateBeneficiary(Long id, BeneficiaryRequest request);
    void deleteBeneficiary(Long id);
}
