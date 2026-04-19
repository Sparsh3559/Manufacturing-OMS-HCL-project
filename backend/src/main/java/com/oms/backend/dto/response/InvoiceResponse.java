package com.oms.backend.dto.response;

import com.oms.backend.model.Invoice;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class InvoiceResponse {

    private UUID id;
    private UUID orderId;
    private String invoiceNumber;
    private BigDecimal amount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private Invoice.InvoiceStatus status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    public static InvoiceResponse from(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setOrderId(invoice.getOrder().getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setAmount(invoice.getAmount());
        response.setTaxAmount(invoice.getTaxAmount());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setStatus(invoice.getStatus());
        response.setDueDate(invoice.getDueDate());
        response.setCreatedAt(invoice.getCreatedAt());
        return response;
    }
}
