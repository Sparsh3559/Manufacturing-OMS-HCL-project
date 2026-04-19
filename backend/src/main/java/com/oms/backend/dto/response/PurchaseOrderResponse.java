package com.oms.backend.dto.response;

import com.oms.backend.model.PurchaseOrder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class PurchaseOrderResponse {

    private UUID id;
    private UUID orderId;
    private String supplierName;
    private String supplierEmail;
    private String supplierPhone;
    private BigDecimal totalAmount;
    private LocalDate expectedDelivery;
    private LocalDate actualDelivery;
    private PurchaseOrder.PurchaseOrderStatus status;
    private String remarks;
    private LocalDateTime createdAt;

    public static PurchaseOrderResponse from(PurchaseOrder po) {
        PurchaseOrderResponse response = new PurchaseOrderResponse();
        response.setId(po.getId());
        response.setOrderId(po.getOrder().getId());
        response.setSupplierName(po.getSupplierName());
        response.setSupplierEmail(po.getSupplierEmail());
        response.setSupplierPhone(po.getSupplierPhone());
        response.setTotalAmount(po.getTotalAmount());
        response.setExpectedDelivery(po.getExpectedDelivery());
        response.setActualDelivery(po.getActualDelivery());
        response.setStatus(po.getStatus());
        response.setRemarks(po.getRemarks());
        response.setCreatedAt(po.getCreatedAt());
        return response;
    }
}