package com.bank.fundtransfer.repository;

import com.bank.fundtransfer.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    Optional<Account> findByUserId(Long userId);
    boolean existsByAccountNumber(String accountNumber);
}
