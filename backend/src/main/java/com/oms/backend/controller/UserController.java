package com.oms.backend.controller;

import com.oms.backend.dto.request.CreateUserRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.UserResponse;
import com.oms.backend.model.User;
import com.oms.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // POST /api/users
    // Admin creates a new user
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request) {

        User user = userService.createUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", UserResponse.from(user)));
    }

    // GET /api/users
    // Get all users
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Users fetched successfully", users)
        );
    }

    // GET /api/users/{id}
    // Get one user by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable UUID id) {

        User user = userService.getUserById(id);
        return ResponseEntity.ok(
                ApiResponse.success("User fetched successfully", UserResponse.from(user))
        );
    }

    // PUT /api/users/{id}
    // Update user name and role
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody CreateUserRequest request) {

        User user = userService.updateUser(id, request.getName(), request.getRole());
        return ResponseEntity.ok(
                ApiResponse.success("User updated successfully", UserResponse.from(user))
        );
    }

    // PATCH /api/users/{id}/deactivate
    // Deactivate a user
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<UserResponse>> deactivateUser(
            @PathVariable UUID id) {

        User user = userService.deactivateUser(id);
        return ResponseEntity.ok(
                ApiResponse.success("User deactivated successfully", UserResponse.from(user))
        );
    }

    // PATCH /api/users/{id}/activate
    // Reactivate a user
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<UserResponse>> activateUser(
            @PathVariable UUID id) {

        User user = userService.activateUser(id);
        return ResponseEntity.ok(
                ApiResponse.success("User activated successfully", UserResponse.from(user))
        );
    }
}