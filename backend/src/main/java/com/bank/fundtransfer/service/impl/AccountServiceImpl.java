package com.bank.fundtransfer.service.impl;

import com.bank.fundtransfer.dto.AccountBalanceResponse;
import com.bank.fundtransfer.dto.AmountRequest;
import com.bank.fundtransfer.entity.Account;
import com.bank.fundtransfer.entity.Transaction;
import com.bank.fundtransfer.exception.AccountNotFoundException;
import com.bank.fundtransfer.repository.AccountRepository;
import com.bank.fundtransfer.repository.TransactionRepository;
import com.bank.fundtransfer.service.AccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public AccountBalanceResponse getBalance(Long accountId) {
        Account account = findAccountById(accountId);
        return toBalanceResponse(account);
    }

    @Override
    @Transactional
    public AccountBalanceResponse deposit(AmountRequest request) {
        Account account = findAccountById(request.accountId());
        BigDecimal updatedBalance = account.getBalance().add(request.amount());
        account.setBalance(updatedBalance);
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .senderAccount(account.getAccountNumber())
                .receiverAccount(account.getAccountNumber())
                .amount(request.amount())
                .date(LocalDateTime.now())
                .status("DEPOSIT")
                .remarks("Deposit")
                .build();
        transactionRepository.save(transaction);

        return toBalanceResponse(account);
    }

    @Override
    @Transactional
    public AccountBalanceResponse withdraw(AmountRequest request) {
        Account account = findAccountById(request.accountId());
        if (account.getBalance().compareTo(request.amount()) < 0) {
            throw new com.bank.fundtransfer.exception.InsufficientBalanceException("Insufficient balance for withdrawal");
        }
        BigDecimal updatedBalance = account.getBalance().subtract(request.amount());
        account.setBalance(updatedBalance);
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .senderAccount(account.getAccountNumber())
                .receiverAccount(account.getAccountNumber())
                .amount(request.amount())
                .date(LocalDateTime.now())
                .status("WITHDRAW")
                .remarks("Withdrawal")
                .build();
        transactionRepository.save(transaction);

        return toBalanceResponse(account);
    }

    private Account findAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with id: " + accountId));
    }

    private AccountBalanceResponse toBalanceResponse(Account account) {
        return new AccountBalanceResponse(account.getId(), account.getAccountNumber(), account.getBalance());
    }
}
