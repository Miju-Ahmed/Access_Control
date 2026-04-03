package com.miju.Finance_DataProcessing_AccessControl.repository;

import com.miju.Finance_DataProcessing_AccessControl.entity.FinancialRecord;
import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.CategoryTotalResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.MonthlyTrendResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long>,
        JpaSpecificationExecutor<FinancialRecord> {

    // ─── Aggregation for Dashboard Summary ───────────────────────────────────

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.type = :type AND r.deleted = false")
    BigDecimal sumByType(@Param("type") RecordType type);

    // ─── Category Totals ──────────────────────────────────────────────────────

    @Query("""
            SELECT new com.miju.Finance_DataProcessing_AccessControl.dto.response.CategoryTotalResponse(
                r.category, r.type, COALESCE(SUM(r.amount), 0))
            FROM FinancialRecord r
            WHERE r.deleted = false
            GROUP BY r.category, r.type
            ORDER BY r.category
            """)
    List<CategoryTotalResponse> findCategoryTotals();

    // ─── Monthly Trends ───────────────────────────────────────────────────────

    @Query("""
            SELECT new com.miju.Finance_DataProcessing_AccessControl.dto.response.MonthlyTrendResponse(
                YEAR(r.date), MONTH(r.date), r.type, COALESCE(SUM(r.amount), 0))
            FROM FinancialRecord r
            WHERE r.deleted = false
            GROUP BY YEAR(r.date), MONTH(r.date), r.type
            ORDER BY YEAR(r.date) ASC, MONTH(r.date) ASC
            """)
    List<MonthlyTrendResponse> findMonthlyTrends();

    // ─── Recent Transactions ──────────────────────────────────────────────────

    @Query("SELECT r FROM FinancialRecord r WHERE r.deleted = false ORDER BY r.date DESC, r.createdAt DESC")
    List<FinancialRecord> findRecentTransactions(Pageable pageable);

    // ─── Filtered Listing ─────────────────────────────────────────────────────

    @Query("""
            SELECT r FROM FinancialRecord r
            WHERE r.deleted = false
              AND (:startDate IS NULL OR r.date >= :startDate)
              AND (:endDate   IS NULL OR r.date <= :endDate)
              AND (:category  IS NULL OR LOWER(r.category) = LOWER(:category))
              AND (:type      IS NULL OR r.type = :type)
            """)
    Page<FinancialRecord> findWithFilters(
            @Param("startDate") LocalDate startDate,
            @Param("endDate")   LocalDate endDate,
            @Param("category")  String category,
            @Param("type")      RecordType type,
            Pageable pageable);
}
