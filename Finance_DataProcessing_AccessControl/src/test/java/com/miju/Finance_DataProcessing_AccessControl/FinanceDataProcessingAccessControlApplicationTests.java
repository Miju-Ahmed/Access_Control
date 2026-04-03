package com.miju.Finance_DataProcessing_AccessControl;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Application context smoke test.
 *
 * Runs with an in-memory H2 datasource so no real MySQL is needed in CI.
 * Production configuration is validated by integration tests separately.
 */
@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.jwt.secret=dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3Rpbmctb25seQ==",
        "app.jwt.expiration-ms=3600000"
})
class FinanceDataProcessingAccessControlApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring ApplicationContext starts without errors
    }
}
