package com.miju.Finance_DataProcessing_AccessControl.dto.response;

import com.miju.Finance_DataProcessing_AccessControl.entity.FinancialRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialRecordResponse {

    private Long id;
    private BigDecimal amount;
    private String type;
    private String category;
    private LocalDate date;
    private String description;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FinancialRecordResponse from(FinancialRecord r) {
        return FinancialRecordResponse.builder()
                .id(r.getId())
                .amount(r.getAmount())
                .type(r.getType().name())
                .category(r.getCategory())
                .date(r.getDate())
                .description(r.getDescription())
                .createdById(r.getCreatedBy().getId())
                .createdByName(r.getCreatedBy().getName())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
