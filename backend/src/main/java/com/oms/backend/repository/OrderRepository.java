package com.oms.backend.repository;

import com.oms.backend.model.Order;
import com.oms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // All orders created by a specific user
    // A sales rep should only see their own orders
    List<Order> findByCreatedBy(User user);

    // Filter orders by their current status
    // e.g. get all PENDING orders
    List<Order> findByStatus(Order.OrderStatus status);

    // Search orders by customer name (case-insensitive, partial match)
    // e.g. searching "abc" will find "ABC Corp" and "Xabc Ltd"
    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);

    // Orders created within a date range
    // Used for reports - "show me all orders this month"
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Count how many orders exist per status
    // Used for the dashboard summary cards
    long countByStatus(Order.OrderStatus status);

    // Custom JPQL query - orders by status AND created by a specific user
    // JPQL uses class names and field names, not table/column names
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdBy = :user")
    List<Order> findByStatusAndCreatedBy(
            @Param("status") Order.OrderStatus status,
            @Param("user") User user
    );
}