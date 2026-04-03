package com.miju.Finance_DataProcessing_AccessControl.controller;

import com.miju.Finance_DataProcessing_AccessControl.dto.response.CategoryTotalResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.DashboardSummaryResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.FinancialRecordResponse;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.MonthlyTrendResponse;
import com.miju.Finance_DataProcessing_AccessControl.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated analytics for the finance dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Full composite summary: income, expenses, net balance, category totals,
     * monthly trends, and latest N transactions — in a single request.
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    @Operation(summary = "Full dashboard summary [ALL ROLES]")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @RequestParam(defaultValue = "5") int recentLimit) {
        return ResponseEntity.ok(dashboardService.getSummary(recentLimit));
    }

    /**
     * Category-wise income/expense totals.
     * Restricted to ANALYST and ADMIN — VIEWER cannot access analytics.
     */
    @GetMapping("/category-totals")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    @Operation(summary = "Category-wise totals [ANALYST, ADMIN]")
    public ResponseEntity<List<CategoryTotalResponse>> getCategoryTotals() {
        return ResponseEntity.ok(dashboardService.getCategoryTotals());
    }

    /**
     * Monthly trends showing income vs expenses by year-month.
     * Restricted to ANALYST and ADMIN.
     */
    @GetMapping("/monthly-trends")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    @Operation(summary = "Monthly income/expense trends [ANALYST, ADMIN]")
    public ResponseEntity<List<MonthlyTrendResponse>> getMonthlyTrends() {
        return ResponseEntity.ok(dashboardService.getMonthlyTrends());
    }

    /**
     * Returns the most recent N financial records ordered by date descending.
     */
    @GetMapping("/recent-transactions")
    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    @Operation(summary = "Recent transactions [ALL ROLES]")
    public ResponseEntity<List<FinancialRecordResponse>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentTransactions(limit));
    }
}
