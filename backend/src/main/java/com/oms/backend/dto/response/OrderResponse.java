package com.oms.backend.dto.response;

import com.oms.backend.model.Order;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class OrderResponse {

    private UUID id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String productName;
    private Integer quantity;
    private String notes;
    private Order.OrderStatus status;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse from(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setProductName(order.getProductName());
        response.setQuantity(order.getQuantity());
        response.setNotes(order.getNotes());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        // Only include the name of who created it, not the full User object
        if (order.getCreatedBy() != null) {
            response.setCreatedByName(order.getCreatedBy().getName());
        }

        return response;
    }
}