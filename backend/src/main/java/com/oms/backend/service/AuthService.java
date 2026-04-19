package com.oms.backend.service;

import com.oms.backend.config.JwtService;
import com.oms.backend.dto.response.AuthResponse;
import com.oms.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(String email, String rawPassword) {
        User user = userService.getUserByEmail(email);

        if (!user.isActive()) {
            throw new IllegalStateException("User account is deactivated");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        log.info("User {} logged in successfully", email);

        // Generate real JWT token
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId().toString()
        );

        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }
}