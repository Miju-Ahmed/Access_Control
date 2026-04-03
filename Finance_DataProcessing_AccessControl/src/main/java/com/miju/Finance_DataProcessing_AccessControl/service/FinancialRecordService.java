package com.miju.Finance_DataProcessing_AccessControl.service;

import com.miju.Finance_DataProcessing_AccessControl.dto.request.FinancialRecordRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.FinancialRecordResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.PagedResponse;
import com.miju.Finance_DataProcessing_AccessControl.entity.FinancialRecord;
import com.miju.Finance_DataProcessing_AccessControl.entity.User;
import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import com.miju.Finance_DataProcessing_AccessControl.exception.ResourceNotFoundException;
import com.miju.Finance_DataProcessing_AccessControl.repository.FinancialRecordRepository;
import com.miju.Finance_DataProcessing_AccessControl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinancialRecordService {

    private final FinancialRecordRepository recordRepository;
    private final UserRepository            userRepository;

    // ─── Create ─────────────────────────────────────────────────────────────

    @Transactional
    public FinancialRecordResponse createRecord(FinancialRecordRequest request) {
        User currentUser = resolveCurrentUser();

        FinancialRecord record = FinancialRecord.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate())
                .description(request.getDescription())
                .createdBy(currentUser)
                .deleted(false)
                .build();

        record = recordRepository.save(record);
        log.info("Financial record created: id={}, type={}, amount={}", record.getId(), record.getType(), record.getAmount());
        return FinancialRecordResponse.from(record);
    }

    // ─── Read (list with filters + pagination) ───────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<FinancialRecordResponse> getRecords(
            LocalDate startDate, LocalDate endDate,
            String category, RecordType type,
            int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date", "createdAt"));

        Page<FinancialRecord> result = recordRepository.findWithFilters(
                startDate, endDate, category, type, pageable);

        Page<FinancialRecordResponse> mapped = result.map(FinancialRecordResponse::from);
        return PagedResponse.of(mapped);
    }

    // ─── Read (single) ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public FinancialRecordResponse getRecordById(Long id) {
        return FinancialRecordResponse.from(findActiveRecordOrThrow(id));
    }

    // ─── Update ─────────────────────────────────────────────────────────────

    @Transactional
    public FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request) {
        FinancialRecord record = findActiveRecordOrThrow(id);

        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setDescription(request.getDescription());

        record = recordRepository.save(record);
        log.info("Financial record updated: id={}", record.getId());
        return FinancialRecordResponse.from(record);
    }

    // ─── Soft Delete ─────────────────────────────────────────────────────────

    @Transactional
    public void deleteRecord(Long id) {
        FinancialRecord record = findActiveRecordOrThrow(id);
        record.setDeleted(true);
        recordRepository.save(record);
        log.info("Financial record soft-deleted: id={}", id);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private FinancialRecord findActiveRecordOrThrow(Long id) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FinancialRecord", id));
        if (record.isDeleted()) {
            throw new ResourceNotFoundException("FinancialRecord", id);
        }
        return record;
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
    }
}
