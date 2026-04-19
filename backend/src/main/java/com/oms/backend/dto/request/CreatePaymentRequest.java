package com.oms.backend.dto.request;

import com.oms.backend.model.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreatePaymentRequest {

    @NotNull(message = "Amount paid is required")
    private BigDecimal amountPaid;

    @NotNull(message = "Payment method is required")
    private Payment.PaymentMethod paymentMethod;

    private String referenceNumber;
    private String remarks;
}