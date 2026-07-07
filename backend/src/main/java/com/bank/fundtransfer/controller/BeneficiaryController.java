package com.bank.fundtransfer.controller;

import com.bank.fundtransfer.dto.BeneficiaryRequest;
import com.bank.fundtransfer.dto.BeneficiaryResponse;
import com.bank.fundtransfer.service.BeneficiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@Tag(name = "Beneficiaries", description = "Beneficiary management APIs")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @PostMapping
    @Operation(summary = "Add a new beneficiary")
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(@Valid @RequestBody BeneficiaryRequest request) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(request));
    }

    @GetMapping
    @Operation(summary = "Get beneficiaries for an account")
    public ResponseEntity<List<BeneficiaryResponse>> getBeneficiaries(@RequestParam Long accountId) {
        return ResponseEntity.ok(beneficiaryService.getAllBeneficiaries(accountId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing beneficiary")
    public ResponseEntity<BeneficiaryResponse> updateBeneficiary(@PathVariable Long id,
                                                                 @Valid @RequestBody BeneficiaryRequest request) {
        return ResponseEntity.ok(beneficiaryService.updateBeneficiary(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a beneficiary")
    public ResponseEntity<Void> deleteBeneficiary(@PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(id);
        return ResponseEntity.noContent().build();
    }
}
