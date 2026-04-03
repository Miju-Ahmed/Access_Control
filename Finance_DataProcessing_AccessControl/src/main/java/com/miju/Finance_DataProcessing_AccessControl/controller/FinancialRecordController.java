package com.miju.Finance_DataProcessing_AccessControl.controller;

import com.miju.Finance_DataProcessing_AccessControl.dto.request.FinancialRecordRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.FinancialRecordResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.PagedResponse;
import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import com.miju.Finance_DataProcessing_AccessControl.service.FinancialRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@Tag(name = "Financial Records", description = "CRUD operations on financial records")
public class FinancialRecordController {

    private final FinancialRecordService recordService;

    // ── Create ────────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a financial record [ADMIN]")
    public ResponseEntity<FinancialRecordResponse> createRecord(
            @Valid @RequestBody FinancialRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recordService.createRecord(request));
    }

    // ── Read (list with filters) ──────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    @Operation(summary = "List records with optional filters and pagination [ALL ROLES]")
    public ResponseEntity<PagedResponse<FinancialRecordResponse>> getRecords(
            @Parameter(description = "Start date (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @Parameter(description = "End date (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @Parameter(description = "Category name (case-insensitive)")
            @RequestParam(required = false) String category,

            @Parameter(description = "Record type: INCOME or EXPENSE")
            @RequestParam(required = false) RecordType type,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                recordService.getRecords(startDate, endDate, category, type, page, size));
    }

    // ── Read (single) ─────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    @Operation(summary = "Get a single record by ID [ALL ROLES]")
    public ResponseEntity<FinancialRecordResponse> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(recordService.getRecordById(id));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a financial record [ADMIN]")
    public ResponseEntity<FinancialRecordResponse> updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody FinancialRecordRequest request) {
        return ResponseEntity.ok(recordService.updateRecord(id, request));
    }

    // ── Soft Delete ───────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft-delete a financial record [ADMIN]")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        recordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
