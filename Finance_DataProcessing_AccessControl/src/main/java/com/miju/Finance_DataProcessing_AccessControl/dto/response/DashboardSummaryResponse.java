package com.miju.Finance_DataProcessing_AccessControl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Top-level dashboard summary aggregating income, expenses, and net balance.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private List<CategoryTotalResponse> categoryTotals;
    private List<MonthlyTrendResponse> monthlyTrends;
    private List<FinancialRecordResponse> recentTransactions;
}
