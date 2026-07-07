package com.bank.fundtransfer.repository;

import com.bank.fundtransfer.entity.Beneficiary;
import com.bank.fundtransfer.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByAccount(Account account);
    Optional<Beneficiary> findByIdAndAccount(Long id, Account account);
}
