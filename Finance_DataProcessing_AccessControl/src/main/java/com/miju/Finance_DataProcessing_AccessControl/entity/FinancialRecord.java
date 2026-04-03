package com.miju.Finance_DataProcessing_AccessControl.entity;

import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A single financial event — either an income or an expense.
 * Soft-delete is used: records are never physically removed.
 */
@Entity
@Table(name = "financial_records",
        indexes = {
                @Index(name = "idx_record_date", columnList = "date"),
                @Index(name = "idx_record_type", columnList = "type"),
                @Index(name = "idx_record_category", columnList = "category"),
                @Index(name = "idx_record_created_by", columnList = "created_by_id")
        })
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private RecordType type;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    /** Soft-delete flag. Deleted records stay in DB for auditing. */
    @Builder.Default
    @Column(nullable = false)
    private boolean deleted = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
