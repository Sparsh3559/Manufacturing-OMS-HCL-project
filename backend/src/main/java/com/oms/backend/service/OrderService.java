package com.oms.backend.service;

import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.Order;
import com.oms.backend.model.User;
import com.oms.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;

    @Transactional
    public Order createOrder(String customerName,
                             String customerEmail,
                             String customerPhone,
                             String productName,
                             Integer quantity,
                             String notes,
                             UUID createdByUserId) {

        log.info("Creating order for customer: {} by user: {}", customerName, createdByUserId);

        User createdBy = userService.getUserById(createdByUserId);

        Order order = Order.builder()
                .customerName(customerName)
                .customerEmail(customerEmail)
                .customerPhone(customerPhone)
                .productName(productName)
                .quantity(quantity)
                .notes(notes)
                .status(Order.OrderStatus.PENDING)
                .createdBy(createdBy)
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order created with id: {}", savedOrder.getId());
        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUser(UUID userId) {
        User user = userService.getUserById(userId);
        return orderRepository.findByCreatedBy(user);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Order> searchByCustomerName(String customerName) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(customerName);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersBetweenDates(LocalDateTime start, LocalDateTime end) {
        return orderRepository.findByCreatedAtBetween(start, end);
    }

    @Transactional
    public Order updateOrderStatus(UUID id, Order.OrderStatus newStatus) {
        Order order = getOrderById(id);

        log.info("Updating order {} status from {} to {}", id, order.getStatus(), newStatus);

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update a cancelled order");
        }

        if (newStatus == Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalStateException("Cannot move order back to PENDING");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(UUID id,
                             String customerName,
                             String customerEmail,
                             String customerPhone,
                             String productName,
                             Integer quantity,
                             String notes) {

        Order order = getOrderById(id);

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalStateException(
                    "Order can only be edited when PENDING. Current status: " + order.getStatus()
            );
        }

        order.setCustomerName(customerName);
        order.setCustomerEmail(customerEmail);
        order.setCustomerPhone(customerPhone);
        order.setProductName(productName);
        order.setQuantity(quantity);
        order.setNotes(notes);

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(UUID id) {
        Order order = getOrderById(id);

        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel an order that has already been delivered");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        log.info("Order {} has been cancelled", id);
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getOrderStatusCounts() {
        return Map.of(
                "pending",    orderRepository.countByStatus(Order.OrderStatus.PENDING),
                "processing", orderRepository.countByStatus(Order.OrderStatus.PROCESSING),
                "dispatched", orderRepository.countByStatus(Order.OrderStatus.DISPATCHED),
                "delivered",  orderRepository.countByStatus(Order.OrderStatus.DELIVERED),
                "cancelled",  orderRepository.countByStatus(Order.OrderStatus.CANCELLED)
        );
    }
}