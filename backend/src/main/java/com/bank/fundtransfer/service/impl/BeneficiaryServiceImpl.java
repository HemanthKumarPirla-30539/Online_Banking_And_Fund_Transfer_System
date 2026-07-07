package com.bank.fundtransfer.service.impl;

import com.bank.fundtransfer.dto.BeneficiaryRequest;
import com.bank.fundtransfer.dto.BeneficiaryResponse;
import com.bank.fundtransfer.entity.Account;
import com.bank.fundtransfer.entity.Beneficiary;
import com.bank.fundtransfer.exception.AccountNotFoundException;
import com.bank.fundtransfer.exception.BeneficiaryNotFoundException;
import com.bank.fundtransfer.repository.AccountRepository;
import com.bank.fundtransfer.repository.BeneficiaryRepository;
import com.bank.fundtransfer.service.BeneficiaryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;

    public BeneficiaryServiceImpl(BeneficiaryRepository beneficiaryRepository, AccountRepository accountRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional
    public BeneficiaryResponse addBeneficiary(BeneficiaryRequest request) {
        Account account = findAccountById(request.accountId());
        Beneficiary beneficiary = Beneficiary.builder()
                .beneficiaryName(request.beneficiaryName())
                .beneficiaryAccountNumber(request.beneficiaryAccountNumber())
                .bankName(request.bankName())
                .ifsc(request.ifsc())
                .addedDate(LocalDateTime.now())
                .account(account)
                .build();
        Beneficiary saved = beneficiaryRepository.save(beneficiary);
        return toResponse(saved);
    }

    @Override
    public List<BeneficiaryResponse> getAllBeneficiaries(Long accountId) {
        Account account = findAccountById(accountId);
        return beneficiaryRepository.findByAccount(account)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BeneficiaryResponse updateBeneficiary(Long id, BeneficiaryRequest request) {
        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not found with id: " + id));

        beneficiary.setBeneficiaryName(request.beneficiaryName());
        beneficiary.setBeneficiaryAccountNumber(request.beneficiaryAccountNumber());
        beneficiary.setBankName(request.bankName());
        beneficiary.setIfsc(request.ifsc());
        return toResponse(beneficiaryRepository.save(beneficiary));
    }

    @Override
    @Transactional
    public void deleteBeneficiary(Long id) {
        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not found with id: " + id));
        beneficiaryRepository.delete(beneficiary);
    }

    private Account findAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with id: " + accountId));
    }

    private BeneficiaryResponse toResponse(Beneficiary beneficiary) {
        return new BeneficiaryResponse(
                beneficiary.getId(),
                beneficiary.getBeneficiaryName(),
                beneficiary.getBeneficiaryAccountNumber(),
                beneficiary.getBankName(),
                beneficiary.getIfsc(),
                beneficiary.getAddedDate(),
                beneficiary.getAccount().getId()
        );
    }
}
