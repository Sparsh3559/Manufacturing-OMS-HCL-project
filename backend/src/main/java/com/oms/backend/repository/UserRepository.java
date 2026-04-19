package com.oms.backend.repository;

import com.oms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Find a user by their email address
    // Used during login to check if this email exists
    Optional<User> findByEmail(String email);

    // Check if an email is already registered
    // Used during user creation to prevent duplicates
    boolean existsByEmail(String email);

    // Find all users who have a specific role
    // Used by admin to list all sales reps, all finance users etc.
    java.util.List<User> findByRole(User.Role role);

    // Find only active users
    java.util.List<User> findByIsActiveTrue();
}