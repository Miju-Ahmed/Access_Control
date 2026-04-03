package com.miju.Finance_DataProcessing_AccessControl.enums;

/**
 * Application roles for Role-Based Access Control (RBAC).
 * <ul>
 *   <li>VIEWER  – read-only access to records and basic summaries</li>
 *   <li>ANALYST – read + analytics access (category totals, monthly trends)</li>
 *   <li>ADMIN   – full CRUD on users and financial records</li>
 * </ul>
 */
public enum Role {
    VIEWER,
    ANALYST,
    ADMIN
}
