package com.miju.Finance_DataProcessing_AccessControl.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables JPA auditing so {@code @CreatedDate} and {@code @LastModifiedDate}
 * are automatically populated on every save.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
