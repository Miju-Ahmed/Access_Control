package com.miju.Finance_DataProcessing_AccessControl.service;

import com.miju.Finance_DataProcessing_AccessControl.dto.request.LoginRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.request.RegisterRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.AuthResponse;
import com.miju.Finance_DataProcessing_AccessControl.entity.User;
import com.miju.Finance_DataProcessing_AccessControl.enums.Role;
import com.miju.Finance_DataProcessing_AccessControl.exception.BadRequestException;
import com.miju.Finance_DataProcessing_AccessControl.repository.UserRepository;
import com.miju.Finance_DataProcessing_AccessControl.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock UserRepository        userRepository;
    @Mock PasswordEncoder       passwordEncoder;
    @Mock JwtTokenProvider      jwtTokenProvider;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks
    AuthService authService;

    private RegisterRequest registerRequest;
    private User            savedUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Alice Smith");
        registerRequest.setEmail("alice@example.com");
        registerRequest.setPassword("secret123");

        savedUser = User.builder()
                .id(1L)
                .name("Alice Smith")
                .email("alice@example.com")
                .password("encoded-password")
                .role(Role.VIEWER)
                .active(true)
                .build();
    }

    // ── register ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register() → success: returns AuthResponse with VIEWER role")
    void register_success() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtTokenProvider.generateToken("alice@example.com")).thenReturn("jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getRole()).isEqualTo("VIEWER");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getTokenType()).isEqualTo("Bearer");

        verify(userRepository).save(any(User.class));
        verify(jwtTokenProvider).generateToken("alice@example.com");
    }

    @Test
    @DisplayName("register() → throws BadRequestException when email already exists")
    void register_duplicateEmail_throws() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any());
    }

    // ── login ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login() → success: returns AuthResponse with JWT")
    void login_success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alice@example.com");
        loginRequest.setPassword("secret123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("jwt-token");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(savedUser));

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getRole()).isEqualTo("VIEWER");
    }
}
