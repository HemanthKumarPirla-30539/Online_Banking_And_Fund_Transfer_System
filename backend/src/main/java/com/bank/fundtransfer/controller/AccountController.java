package com.bank.fundtransfer.controller;

import com.bank.fundtransfer.dto.AccountBalanceResponse;
import com.bank.fundtransfer.dto.AmountRequest;
import com.bank.fundtransfer.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@Tag(name = "Account", description = "Account management APIs")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "Get account details")
    public ResponseEntity<AccountBalanceResponse> getAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getBalance(accountId));
    }

    @GetMapping("/{accountId}/balance")
    @Operation(summary = "Get current balance")
    public ResponseEntity<AccountBalanceResponse> getBalance(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getBalance(accountId));
    }

    @PostMapping("/deposit")
    @Operation(summary = "Deposit amount into account")
    public ResponseEntity<AccountBalanceResponse> deposit(@Valid @RequestBody AmountRequest request) {
        return ResponseEntity.ok(accountService.deposit(request));
    }

    @PostMapping("/withdraw")
    @Operation(summary = "Withdraw amount from account")
    public ResponseEntity<AccountBalanceResponse> withdraw(@Valid @RequestBody AmountRequest request) {
        return ResponseEntity.ok(accountService.withdraw(request));
    }
}
