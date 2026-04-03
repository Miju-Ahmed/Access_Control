package com.miju.Finance_DataProcessing_AccessControl.service;

import com.miju.Finance_DataProcessing_AccessControl.dto.request.CreateUserRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.request.UpdateUserRequest;
import com.miju.Finance_DataProcessing_AccessControl.dto.response.UserResponse;
import com.miju.Finance_DataProcessing_AccessControl.entity.User;
import com.miju.Finance_DataProcessing_AccessControl.exception.BadRequestException;
import com.miju.Finance_DataProcessing_AccessControl.exception.ResourceNotFoundException;
import com.miju.Finance_DataProcessing_AccessControl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** Retrieve all users (admin view). */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    /** Retrieve a single user by ID. */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return UserResponse.from(findUserOrThrow(id));
    }

    /** Admin creates a user with an explicit role. */
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        user = userRepository.save(user);
        log.info("Admin created user: {} with role {}", user.getEmail(), user.getRole());
        return UserResponse.from(user);
    }

    /** Partial update — only non-null fields are applied. */
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = findUserOrThrow(id);

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName());
        }
        if (StringUtils.hasText(request.getEmail())) {
            if (!user.getEmail().equals(request.getEmail())
                    && userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email address is already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        user = userRepository.save(user);
        log.info("User {} updated", user.getEmail());
        return UserResponse.from(user);
    }

    /** Soft-deactivate a user account. The row remains in the DB. */
    @Transactional
    public UserResponse deactivateUser(Long id) {
        User user = findUserOrThrow(id);
        if (!user.isActive()) {
            throw new BadRequestException("User is already deactivated");
        }
        user.setActive(false);
        user = userRepository.save(user);
        log.info("User {} deactivated", user.getEmail());
        return UserResponse.from(user);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
}
