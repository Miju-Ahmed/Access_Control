package com.miju.Finance_DataProcessing_AccessControl.dto.response;

import com.miju.Finance_DataProcessing_AccessControl.enums.RecordType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Projection returned by the category-totals dashboard query.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTotalResponse {

    private String category;
    private RecordType type;
    private BigDecimal total;
}
