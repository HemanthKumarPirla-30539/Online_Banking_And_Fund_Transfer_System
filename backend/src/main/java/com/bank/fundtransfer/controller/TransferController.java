package com.bank.fundtransfer.controller;

import com.bank.fundtransfer.dto.TransferRequest;
import com.bank.fundtransfer.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfer")
@Tag(name = "Transfer", description = "Fund transfer APIs")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    @Operation(summary = "Transfer funds between accounts")
    public ResponseEntity<Void> transfer(@Valid @RequestBody TransferRequest request) {
        transferService.transfer(request);
        return ResponseEntity.ok().build();
    }
}
