package com.oms.backend.service;

import com.oms.backend.exception.DuplicateResourceException;
import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.Order;
import com.oms.backend.model.User;
import com.oms.backend.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Order testOrder;
    private UUID orderId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        orderId = UUID.randomUUID();

        testUser = User.builder()
                .id(userId)
                .name("Test User")
                .email("test@oms.com")
                .role(User.Role.SALES)
                .isActive(true)
                .build();

        testOrder = Order.builder()
                .id(orderId)
                .customerName("ABC Corp")
                .productName("UPS Machine")
                .quantity(5)
                .status(Order.OrderStatus.PENDING)
                .createdBy(testUser)
                .build();
    }

    // Test 1: Order created successfully
    @Test
    void createOrder_Success() {
        when(userService.getUserById(userId)).thenReturn(testUser);
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.createOrder(
                "ABC Corp", "abc@corp.com", "9876543210",
                "UPS Machine", 5, "Urgent", userId
        );

        assertNotNull(result);
        assertEquals("ABC Corp", result.getCustomerName());
        assertEquals(Order.OrderStatus.PENDING, result.getStatus());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    // Test 2: Get order that does not exist throws exception
    @Test
    void getOrderById_NotFound_ThrowsException() {
        UUID fakeId = UUID.randomUUID();
        when(orderRepository.findById(fakeId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.getOrderById(fakeId);
        });
    }

    // Test 3: Cannot cancel a delivered order
    @Test
    void cancelOrder_AlreadyDelivered_ThrowsException() {
        testOrder.setStatus(Order.OrderStatus.DELIVERED);
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        assertThrows(IllegalStateException.class, () -> {
            orderService.cancelOrder(orderId);
        });
    }

    // Test 4: Cannot move order backwards in status
    @Test
    void updateOrderStatus_CannotGoBackToPending_ThrowsException() {
        testOrder.setStatus(Order.OrderStatus.PROCESSING);
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        assertThrows(IllegalStateException.class, () -> {
            orderService.updateOrderStatus(orderId, Order.OrderStatus.PENDING);
        });
    }

    // Test 5: Cannot edit order that is not PENDING
    @Test
    void updateOrder_NotPending_ThrowsException() {
        testOrder.setStatus(Order.OrderStatus.PROCESSING);
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        assertThrows(IllegalStateException.class, () -> {
            orderService.updateOrder(
                    orderId, "New Name", null, null,
                    "New Product", 3, null
            );
        });
    }

    // Test 6: Status update works correctly
    @Test
    void updateOrderStatus_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.updateOrderStatus(
                orderId, Order.OrderStatus.PROCESSING
        );

        assertNotNull(result);
        verify(orderRepository, times(1)).save(any(Order.class));
    }
}