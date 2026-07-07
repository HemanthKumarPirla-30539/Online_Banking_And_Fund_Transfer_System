package com.bank.fundtransfer.repository;

import com.bank.fundtransfer.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderAccountOrReceiverAccount(String senderAccount, String receiverAccount);
}
