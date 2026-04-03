package com.miju.Finance_DataProcessing_AccessControl.service;

import com.miju.Finance_DataProcessing_AccessControl.dto.request.FinancialRecordRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.FinancialRecordResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.PagedResponse;
import com.miju.Finance_DataProcessing_AccessControl.entity.FinancialRecord;
import com.miju.Finance_DataProcessing_AccessControl.entity.User;
import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import com.miju.Finance_DataProcessing_AccessControl.enums.Role;
import com.miju.Finance_DataProcessing_AccessControl.exception.ResourceNotFoundException;
import com.miju.Finance_DataProcessing_AccessControl.repository.FinancialRecordRepository;
import com.miju.Finance_DataProcessing_AccessControl.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FinancialRecordService Unit Tests")
class FinancialRecordServiceTest {

    @Mock FinancialRecordRepository recordRepository;
    @Mock UserRepository            userRepository;

    @InjectMocks
    FinancialRecordService recordService;

    private User            adminUser;
    private FinancialRecord sampleRecord;

    @BeforeEach
    void setUp() {
        adminUser = User.builder()
                .id(1L).name("Admin").email("admin@example.com")
                .role(Role.ADMIN).active(true).build();

        sampleRecord = FinancialRecord.builder()
                .id(10L)
                .amount(new BigDecimal("1500.00"))
                .type(RecordType.INCOME)
                .category("Salary")
                .date(LocalDate.of(2025, 3, 1))
                .description("Monthly salary")
                .createdBy(adminUser)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        // SecurityContext mock is set up per-test only where createRecord() is called
    }

    // ── helper: set up SecurityContext ────────────────────────────────────────

    private void mockAuthentication(String email) {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    // ── createRecord ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("createRecord() → success: saves and returns response")
    void createRecord_success() {
        mockAuthentication("admin@example.com");

        FinancialRecordRequest request = new FinancialRecordRequest();
        request.setAmount(new BigDecimal("1500.00"));
        request.setType(RecordType.INCOME);
        request.setCategory("Salary");
        request.setDate(LocalDate.of(2025, 3, 1));
        request.setDescription("Monthly salary");

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));
        when(recordRepository.save(any(FinancialRecord.class))).thenReturn(sampleRecord);

        FinancialRecordResponse response = recordService.createRecord(request);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getAmount()).isEqualByComparingTo("1500.00");
        assertThat(response.getType()).isEqualTo("INCOME");
        assertThat(response.getCategory()).isEqualTo("Salary");
        verify(recordRepository).save(any(FinancialRecord.class));
    }

    // ── getRecordById ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("getRecordById() → returns response for existing non-deleted record")
    void getRecordById_success() {
        when(recordRepository.findById(10L)).thenReturn(Optional.of(sampleRecord));

        FinancialRecordResponse response = recordService.getRecordById(10L);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getCategory()).isEqualTo("Salary");
    }

    @Test
    @DisplayName("getRecordById() → throws ResourceNotFoundException for unknown id")
    void getRecordById_notFound_throws() {
        when(recordRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recordService.getRecordById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getRecordById() → throws ResourceNotFoundException for soft-deleted record")
    void getRecordById_deletedRecord_throws() {
        sampleRecord.setDeleted(true);
        when(recordRepository.findById(10L)).thenReturn(Optional.of(sampleRecord));

        assertThatThrownBy(() -> recordService.getRecordById(10L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── deleteRecord ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteRecord() → sets deleted=true and saves")
    void deleteRecord_success() {
        when(recordRepository.findById(10L)).thenReturn(Optional.of(sampleRecord));
        when(recordRepository.save(any())).thenReturn(sampleRecord);

        recordService.deleteRecord(10L);

        assertThat(sampleRecord.isDeleted()).isTrue();
        verify(recordRepository).save(sampleRecord);
    }

    // ── getRecords (pagination) ───────────────────────────────────────────────

    @Test
    @DisplayName("getRecords() → returns paged response")
    void getRecords_paged() {
        Page<FinancialRecord> page = new PageImpl<>(List.of(sampleRecord), PageRequest.of(0, 20), 1);
        when(recordRepository.findWithFilters(any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(page);

        PagedResponse<FinancialRecordResponse> result =
                recordService.getRecords(null, null, null, null, 0, 20);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getId()).isEqualTo(10L);
    }
}
