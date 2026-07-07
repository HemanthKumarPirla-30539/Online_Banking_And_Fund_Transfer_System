package com.bank.fundtransfer.service;

import com.bank.fundtransfer.dto.TransferRequest;

public interface TransferService {
    void transfer(TransferRequest request);
}
