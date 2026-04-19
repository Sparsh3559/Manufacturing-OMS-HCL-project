package com.oms.backend.service;

import com.oms.backend.exception.DuplicateResourceException;
import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.User;
import com.oms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Create a brand new user
    // Called by admin when adding a new employee to the system
    @Transactional
    public User createUser(String name, String email, String rawPassword, User.Role role) {
        log.info("Creating new user with email: {}", email);

        // Check if this email is already taken
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("User already exists with email: " + email);
        }

        // Hash the password - NEVER save raw passwords in the database
        String hashedPassword = passwordEncoder.encode(rawPassword);

        User user = User.builder()
                .name(name)
                .email(email)
                .password(hashedPassword)
                .role(role)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User created successfully with id: {}", savedUser.getId());
        return savedUser;
    }

    // Get a single user by their ID
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // Get a user by their email
    // Used by the auth/login process
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    // Get all users in the system
    // Only admin should call this
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get all users of a specific role
    // e.g. get all SALES users to assign orders
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    // Deactivate a user instead of deleting them
    // Deleting users breaks historical data - orders, invoices etc.
    // Better to just mark them inactive
    @Transactional
    public User deactivateUser(UUID id) {
        User user = getUserById(id);
        user.setActive(false);
        return userRepository.save(user);
    }

    // Reactivate a previously deactivated user
    @Transactional
    public User activateUser(UUID id) {
        User user = getUserById(id);
        user.setActive(true);
        return userRepository.save(user);
    }

    // Update user details - name and role only
    // Email changes are not allowed - it is the unique identifier
    @Transactional
    public User updateUser(UUID id, String name, User.Role role) {
        User user = getUserById(id);
        user.setName(name);
        user.setRole(role);
        return userRepository.save(user);
    }
}