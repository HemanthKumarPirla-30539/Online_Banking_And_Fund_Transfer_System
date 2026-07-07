package com.bank.fundtransfer.service.impl;

import com.bank.fundtransfer.dto.TransactionResponse;
import com.bank.fundtransfer.entity.Account;
import com.bank.fundtransfer.entity.Transaction;
import com.bank.fundtransfer.exception.AccountNotFoundException;
import com.bank.fundtransfer.repository.AccountRepository;
import com.bank.fundtransfer.repository.TransactionRepository;
import com.bank.fundtransfer.service.TransactionService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Transaction::getDate).reversed())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getTransactionsByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with id: " + accountId));

        return transactionRepository.findBySenderAccountOrReceiverAccount(account.getAccountNumber(), account.getAccountNumber())
                .stream()
                .sorted(Comparator.comparing(Transaction::getDate).reversed())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getSenderAccount(),
                transaction.getReceiverAccount(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getStatus(),
                transaction.getRemarks()
        );
    }
}
