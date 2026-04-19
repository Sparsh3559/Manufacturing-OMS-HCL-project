package com.oms.backend.dto.response;

import com.oms.backend.model.Payment;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class PaymentResponse {

    private UUID id;
    private UUID invoiceId;
    private BigDecimal amountPaid;
    private Payment.PaymentMethod paymentMethod;
    private String referenceNumber;
    private String remarks;
    private LocalDateTime paymentDate;

    public static PaymentResponse from(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setInvoiceId(payment.getInvoice().getId());
        response.setAmountPaid(payment.getAmountPaid());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setReferenceNumber(payment.getReferenceNumber());
        response.setRemarks(payment.getRemarks());
        response.setPaymentDate(payment.getPaymentDate());
        return response;
    }
}