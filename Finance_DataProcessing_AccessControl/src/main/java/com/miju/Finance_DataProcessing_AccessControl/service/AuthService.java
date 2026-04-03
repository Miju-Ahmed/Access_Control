package com.miju.Finance_DataProcessing_AccessControl.service;

import com.miju.Finance_DataProcessing_AccessControl.dto.request.LoginRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.request.RegisterRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.AuthResponse;
import com.miju.Finance_DataProcessing_AccessControl.entity.User;
import com.miju.Finance_DataProcessing_AccessControl.enums.Role;
import com.miju.Finance_DataProcessing_AccessControl.exception.BadRequestException;
import com.miju.Finance_DataProcessing_AccessControl.repository.UserRepository;
import com.miju.Finance_DataProcessing_AccessControl.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtTokenProvider      jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * Self-registration: every new self-registered user gets the VIEWER role.
     * Admins can create users with elevated roles via UserService.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.VIEWER)
                .active(true)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {} (id={})", user.getEmail(), user.getId());

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    /**
     * Authenticates the user via Spring Security's AuthenticationManager,
     * which internally calls UserDetailsServiceImpl and BCrypt comparison.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        log.info("User logged in: {}", user.getEmail());
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
