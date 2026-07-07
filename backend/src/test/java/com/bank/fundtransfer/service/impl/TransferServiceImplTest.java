package com.bank.fundtransfer.service.impl;

import com.bank.fundtransfer.dto.TransferRequest;
import com.bank.fundtransfer.entity.Account;
import com.bank.fundtransfer.entity.Beneficiary;
import com.bank.fundtransfer.entity.DailyTransferTracker;
import com.bank.fundtransfer.exception.AccountNotFoundException;
import com.bank.fundtransfer.exception.BeneficiaryNotFoundException;
import com.bank.fundtransfer.exception.CoolingPeriodException;
import com.bank.fundtransfer.exception.DailyLimitExceededException;
import com.bank.fundtransfer.exception.InsufficientBalanceException;
import com.bank.fundtransfer.exception.TransferFailedException;
import com.bank.fundtransfer.repository.AccountRepository;
import com.bank.fundtransfer.repository.BeneficiaryRepository;
import com.bank.fundtransfer.repository.DailyTransferTrackerRepository;
import com.bank.fundtransfer.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransferServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private BeneficiaryRepository beneficiaryRepository;

    @Mock
    private DailyTransferTrackerRepository dailyTransferTrackerRepository;

    @Mock
    private TransactionRepository transactionRepository;

    private TransferServiceImpl transferService;

    private Account sender;
    private Account receiver;
    private Beneficiary beneficiary;

    @BeforeEach
    void setUp() {
        transferService = new TransferServiceImpl(
                accountRepository,
                beneficiaryRepository,
                dailyTransferTrackerRepository,
                transactionRepository,
                1440L);

        sender = Account.builder()
                .id(1L)
                .accountNumber("ACC123")
                .balance(BigDecimal.valueOf(60000))
                .build();

        receiver = Account.builder()
                .id(2L)
                .accountNumber("ACC456")
                .balance(BigDecimal.valueOf(1000))
                .build();

        beneficiary = Beneficiary.builder()
                .id(1L)
                .beneficiaryName("Jane Doe")
                .beneficiaryAccountNumber("ACC456")
                .bankName("Test Bank")
                .ifsc("TEST0001")
                .addedDate(LocalDateTime.now().minusHours(25))
                .account(sender)
                .build();
    }

    @Test
    void transferSuccess() {
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.of(receiver));
        when(beneficiaryRepository.findByAccount(sender)).thenReturn(Collections.singletonList(beneficiary));
        when(dailyTransferTrackerRepository.findByAccountAndTransferDate(eq(sender), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(dailyTransferTrackerRepository.save(any(DailyTransferTracker.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(20000), "Rent payment"));

        assertEquals(BigDecimal.valueOf(40000), sender.getBalance());
        assertEquals(BigDecimal.valueOf(21000), receiver.getBalance());
        verify(transactionRepository, times(1)).save(any());
        verify(dailyTransferTrackerRepository, times(1)).save(any(DailyTransferTracker.class));
    }

    @Test
    void shouldThrowWhenSenderMissing() {
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.empty());

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(100), "Test")));

        assertEquals("Sender account not found", exception.getMessage());
    }

    @Test
    void shouldThrowWhenReceiverMissing() {
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.empty());

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(100), "Test")));

        assertEquals("Receiver account not found", exception.getMessage());
    }

    @Test
    void shouldThrowWhenBeneficiaryMissing() {
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.of(receiver));
        when(beneficiaryRepository.findByAccount(sender)).thenReturn(Collections.emptyList());

        BeneficiaryNotFoundException exception = assertThrows(BeneficiaryNotFoundException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(100), "Test")));

        assertEquals("Beneficiary not registered for this sender account", exception.getMessage());
    }

    @Test
    void shouldThrowWhenCoolingPeriodNotMet() {
        beneficiary.setAddedDate(LocalDateTime.now().minusHours(1));
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.of(receiver));
        when(beneficiaryRepository.findByAccount(sender)).thenReturn(Collections.singletonList(beneficiary));

        CoolingPeriodException exception = assertThrows(CoolingPeriodException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(100), "Test")));

        assertEquals("Beneficiary cooling period not completed", exception.getMessage());
    }

    @Test
    void shouldThrowWhenInsufficientBalance() {
        sender.setBalance(BigDecimal.valueOf(50));
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.of(receiver));
        when(beneficiaryRepository.findByAccount(sender)).thenReturn(Collections.singletonList(beneficiary));

        InsufficientBalanceException exception = assertThrows(InsufficientBalanceException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(100), "Test")));

        assertEquals("Insufficient balance for transfer", exception.getMessage());
    }

    @Test
    void shouldThrowWhenDailyLimitExceeded() {
        DailyTransferTracker tracker = DailyTransferTracker.builder()
                .account(sender)
                .transferDate(LocalDate.now())
                .totalTransferred(BigDecimal.valueOf(45000))
                .build();

        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.of(receiver));
        when(beneficiaryRepository.findByAccount(sender)).thenReturn(Collections.singletonList(beneficiary));
        when(dailyTransferTrackerRepository.findByAccountAndTransferDate(eq(sender), any(LocalDate.class)))
                .thenReturn(Optional.of(tracker));

        DailyLimitExceededException exception = assertThrows(DailyLimitExceededException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(6000), "Test")));

        assertEquals("Daily transfer limit exceeded", exception.getMessage());
    }

    @Test
    void shouldWrapExceptionWhenTransactionSaveFails() {
        when(accountRepository.findByAccountNumber("ACC123")).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumber("ACC456")).thenReturn(Optional.of(receiver));
        when(beneficiaryRepository.findByAccount(sender)).thenReturn(Collections.singletonList(beneficiary));
        when(dailyTransferTrackerRepository.findByAccountAndTransferDate(eq(sender), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        doThrow(new RuntimeException("DB failure")).when(transactionRepository).save(any());

        TransferFailedException exception = assertThrows(TransferFailedException.class,
                () -> transferService.transfer(new TransferRequest("ACC123", "ACC456", BigDecimal.valueOf(1000), "Test")));

        assertEquals("Transfer failed and rolled back", exception.getMessage());
    }
}
