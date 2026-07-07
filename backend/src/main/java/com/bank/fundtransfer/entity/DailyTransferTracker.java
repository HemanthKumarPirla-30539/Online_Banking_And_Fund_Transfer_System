package com.bank.fundtransfer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_transfer_tracker")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyTransferTracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private LocalDate transferDate;

    @Column(nullable = false)
    private BigDecimal totalTransferred;
}
