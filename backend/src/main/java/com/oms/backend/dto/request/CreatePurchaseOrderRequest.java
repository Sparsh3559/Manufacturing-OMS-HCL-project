package com.oms.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreatePurchaseOrderRequest {

    @NotBlank(message = "Supplier name is required")
    private String supplierName;

    private String supplierEmail;
    private String supplierPhone;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    private LocalDate expectedDelivery;
    private String remarks;
}