package com.oms.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateInvoiceRequest {

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private BigDecimal taxAmount;
    private LocalDate dueDate;
}