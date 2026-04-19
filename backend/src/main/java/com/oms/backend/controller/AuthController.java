package com.oms.backend.controller;

import com.oms.backend.dto.request.LoginRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.AuthResponse;
import com.oms.backend.model.User;
import com.oms.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login
    // React sends email + password, gets back a token
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Login successful", authResponse)
        );
    }
}