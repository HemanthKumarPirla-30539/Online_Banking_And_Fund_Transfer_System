package com.bank.fundtransfer.service;

import com.bank.fundtransfer.dto.AccountBalanceResponse;
import com.bank.fundtransfer.dto.AmountRequest;

public interface AccountService {
    AccountBalanceResponse getBalance(Long accountId);
    AccountBalanceResponse deposit(AmountRequest request);
    AccountBalanceResponse withdraw(AmountRequest request);
}
