package com.bank.fundtransfer.service;

import com.bank.fundtransfer.dto.TransactionResponse;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getAllTransactions();
    List<TransactionResponse> getTransactionsByAccountId(Long accountId);
}
