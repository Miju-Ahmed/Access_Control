package com.miju.Finance_DataProcessing_AccessControl.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures SpringDoc OpenAPI so Swagger UI shows a JWT Bearer
 * Authorization button and applies it globally to all operations.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Finance Dashboard API")
                        .description(
                                "Production-ready REST API for a Finance Dashboard application.\n\n" +
                                "**Roles:** VIEWER · ANALYST · ADMIN\n\n" +
                                "Use **POST /api/auth/login** to obtain a JWT, then click **Authorize** and paste the token.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Miju Chowdhury")
                                .email("miju@example.com")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Paste your JWT access token here")));
    }
}
