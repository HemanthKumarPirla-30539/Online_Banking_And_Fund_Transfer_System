package com.bank.fundtransfer.exception;

public class BeneficiaryNotFoundException extends RuntimeException {
    public BeneficiaryNotFoundException(String message) {
        super(message);
    }
}
