package com.miju.Finance_DataProcessing_AccessControl.service;

import com.miju.Finance_DataProcessing_AccessControl.dto.response.CategoryTotalResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.DashboardSummaryResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.FinancialRecordResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.MonthlyTrendResponse;
import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import com.miju.Finance_DataProcessing_AccessControl.repository.FinancialRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final FinancialRecordRepository recordRepository;

    /**
     * Returns a composite summary of total income, total expenses, net balance,
     * category-wise totals, monthly trends, and last N transactions.
     *
     * All data is fetched in separate optimized queries (no lazy loading pitfalls)
     * inside a single read-only transaction to guarantee consistency.
     */
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(int recentLimit) {
        BigDecimal totalIncome   = recordRepository.sumByType(RecordType.INCOME);
        BigDecimal totalExpenses = recordRepository.sumByType(RecordType.EXPENSE);
        BigDecimal netBalance    = totalIncome.subtract(totalExpenses);

        List<CategoryTotalResponse>  categoryTotals    = recordRepository.findCategoryTotals();
        List<MonthlyTrendResponse>   monthlyTrends     = recordRepository.findMonthlyTrends();
        List<FinancialRecordResponse> recentTransactions =
                recordRepository.findRecentTransactions(PageRequest.of(0, recentLimit))
                        .stream()
                        .map(FinancialRecordResponse::from)
                        .toList();

        log.debug("Dashboard summary computed: income={}, expenses={}, net={}", totalIncome, totalExpenses, netBalance);

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(netBalance)
                .categoryTotals(categoryTotals)
                .monthlyTrends(monthlyTrends)
                .recentTransactions(recentTransactions)
                .build();
    }

    /** Category-wise totals only (ANALYST+ endpoint). */
    @Transactional(readOnly = true)
    public List<CategoryTotalResponse> getCategoryTotals() {
        return recordRepository.findCategoryTotals();
    }

    /** Monthly income/expense trends (ANALYST+ endpoint). */
    @Transactional(readOnly = true)
    public List<MonthlyTrendResponse> getMonthlyTrends() {
        return recordRepository.findMonthlyTrends();
    }

    /** Most recent N transactions (all authenticated roles). */
    @Transactional(readOnly = true)
    public List<FinancialRecordResponse> getRecentTransactions(int limit) {
        return recordRepository.findRecentTransactions(PageRequest.of(0, limit))
                .stream()
                .map(FinancialRecordResponse::from)
                .toList();
    }
}
