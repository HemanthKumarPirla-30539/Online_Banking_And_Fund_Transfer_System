package com.bank.fundtransfer.service.impl;

import com.bank.fundtransfer.dto.TransferRequest;
import com.bank.fundtransfer.entity.Account;
import com.bank.fundtransfer.entity.Beneficiary;
import com.bank.fundtransfer.entity.DailyTransferTracker;
import com.bank.fundtransfer.entity.Transaction;
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
import com.bank.fundtransfer.service.TransferService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransferServiceImpl implements TransferService {

    private static final BigDecimal DAILY_LIMIT = BigDecimal.valueOf(50000);

    private final AccountRepository accountRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final DailyTransferTrackerRepository dailyTransferTrackerRepository;
    private final TransactionRepository transactionRepository;
    private final long beneficiaryCoolingPeriodMinutes;

    public TransferServiceImpl(AccountRepository accountRepository,
                               BeneficiaryRepository beneficiaryRepository,
                               DailyTransferTrackerRepository dailyTransferTrackerRepository,
                               TransactionRepository transactionRepository,
                               @Value("${beneficiary.cooling-period-minutes}") long beneficiaryCoolingPeriodMinutes) {
        this.accountRepository = accountRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.dailyTransferTrackerRepository = dailyTransferTrackerRepository;
        this.transactionRepository = transactionRepository;
        this.beneficiaryCoolingPeriodMinutes = beneficiaryCoolingPeriodMinutes;
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        Account sender = accountRepository.findByAccountNumber(request.senderAccount())
                .orElseThrow(() -> new AccountNotFoundException("Sender account not found"));

        Account receiver = accountRepository.findByAccountNumber(request.receiverAccount())
                .orElseThrow(() -> new AccountNotFoundException("Receiver account not found"));

        List<Beneficiary> beneficiaries = beneficiaryRepository.findByAccount(sender);
        Beneficiary beneficiary = beneficiaries.stream()
                .filter(b -> b.getBeneficiaryAccountNumber().equals(request.receiverAccount()))
                .findFirst()
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not registered for this sender account"));

        if (beneficiary.getAddedDate().isAfter(LocalDateTime.now().minusMinutes(beneficiaryCoolingPeriodMinutes))) {
            throw new CoolingPeriodException("Beneficiary cooling period not completed");
        }

        if (sender.getBalance().compareTo(request.amount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for transfer");
        }

        DailyTransferTracker tracker = dailyTransferTrackerRepository
                .findByAccountAndTransferDate(sender, LocalDate.now())
                .orElse(DailyTransferTracker.builder()
                        .account(sender)
                        .transferDate(LocalDate.now())
                        .totalTransferred(BigDecimal.ZERO)
                        .build());

        BigDecimal currentTotal = tracker.getTotalTransferred().add(request.amount());
        if (currentTotal.compareTo(DAILY_LIMIT) > 0) {
            throw new DailyLimitExceededException("Daily transfer limit exceeded");
        }

        try {
            sender.setBalance(sender.getBalance().subtract(request.amount()));
            receiver.setBalance(receiver.getBalance().add(request.amount()));

            tracker.setTotalTransferred(currentTotal);
            dailyTransferTrackerRepository.save(tracker);
            accountRepository.save(sender);
            accountRepository.save(receiver);

            Transaction transaction = Transaction.builder()
                    .senderAccount(sender.getAccountNumber())
                    .receiverAccount(receiver.getAccountNumber())
                    .amount(request.amount())
                    .date(LocalDateTime.now())
                    .status("SUCCESS")
                    .remarks(request.remarks())
                    .build();
            transactionRepository.save(transaction);
        } catch (Exception ex) {
            throw new TransferFailedException("Transfer failed and rolled back");
        }
    }
}
