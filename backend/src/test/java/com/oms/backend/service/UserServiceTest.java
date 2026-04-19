package com.oms.backend.service;

import com.oms.backend.exception.DuplicateResourceException;
import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.User;
import com.oms.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        testUser = User.builder()
                .id(userId)
                .name("Admin User")
                .email("admin@oms.com")
                .password("$2b$hashed")
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();
    }

    // Test 1: Create user successfully
    @Test
    void createUser_Success() {
        when(userRepository.existsByEmail("admin@oms.com")).thenReturn(false);
        when(passwordEncoder.encode("admin123")).thenReturn("$2b$hashed");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.createUser(
                "Admin User", "admin@oms.com", "admin123", User.Role.ADMIN
        );

        assertNotNull(result);
        assertEquals("Admin User", result.getName());
        assertEquals("admin@oms.com", result.getEmail());
        verify(passwordEncoder, times(1)).encode("admin123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    // Test 2: Cannot register duplicate email
    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("admin@oms.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(
                    "Another Admin", "admin@oms.com", "pass123", User.Role.ADMIN
            );
        });

        verify(userRepository, never()).save(any(User.class));
    }

    // Test 3: Get user by ID not found
    @Test
    void getUserById_NotFound_ThrowsException() {
        UUID fakeId = UUID.randomUUID();
        when(userRepository.findById(fakeId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(fakeId);
        });
    }

    // Test 4: Deactivate user
    @Test
    void deactivateUser_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.deactivateUser(userId);

        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    // Test 5: Get user by email not found
    @Test
    void getUserByEmail_NotFound_ThrowsException() {
        when(userRepository.findByEmail("fake@email.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserByEmail("fake@email.com");
        });
    }
}