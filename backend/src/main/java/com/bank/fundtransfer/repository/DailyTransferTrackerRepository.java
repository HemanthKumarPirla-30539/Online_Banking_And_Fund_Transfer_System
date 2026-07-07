package com.bank.fundtransfer.repository;

import com.bank.fundtransfer.entity.DailyTransferTracker;
import com.bank.fundtransfer.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyTransferTrackerRepository extends JpaRepository<DailyTransferTracker, Long> {
    Optional<DailyTransferTracker> findByAccountAndTransferDate(Account account, LocalDate transferDate);
}
