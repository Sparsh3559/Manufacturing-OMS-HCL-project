package com.oms.backend.controller;

import com.oms.backend.dto.request.CreateOrderRequest;
import com.oms.backend.dto.request.UpdateOrderRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.OrderResponse;
import com.oms.backend.model.Order;
import com.oms.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {

        Order order = orderService.createOrder(
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getCustomerPhone(),
                request.getProductName(),
                request.getQuantity(),
                request.getNotes(),
                UUID.fromString(request.getCreatedByUserId())
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", OrderResponse.from(order)));
    }

    // GET /api/orders
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {

        List<OrderResponse> orders = orderService.getAllOrders()
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Orders fetched successfully", orders)
        );
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable UUID id) {

        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Order fetched successfully", OrderResponse.from(order))
        );
    }

    // GET /api/orders/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status) {

        List<OrderResponse> orders = orderService.getOrdersByStatus(status)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Orders fetched successfully", orders)
        );
    }

    // GET /api/orders/search?customerName=abc
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> searchOrders(
            @RequestParam String customerName) {

        List<OrderResponse> orders = orderService.searchByCustomerName(customerName)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Search results fetched", orders)
        );
    }

    // PUT /api/orders/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderRequest request) {

        Order order = orderService.updateOrder(
                id,
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getCustomerPhone(),
                request.getProductName(),
                request.getQuantity(),
                request.getNotes()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Order updated successfully", OrderResponse.from(order))
        );
    }

    // PATCH /api/orders/{id}/status?newStatus=PROCESSING
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam Order.OrderStatus newStatus) {

        Order order = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(
                ApiResponse.success("Order status updated", OrderResponse.from(order))
        );
    }

    // PATCH /api/orders/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable UUID id) {

        Order order = orderService.cancelOrder(id);
        return ResponseEntity.ok(
                ApiResponse.success("Order cancelled successfully", OrderResponse.from(order))
        );
    }

    // GET /api/orders/summary
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getOrderSummary() {
        return ResponseEntity.ok(
                ApiResponse.success("Order summary fetched", orderService.getOrderStatusCounts())
        );
    }
}