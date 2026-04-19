package com.oms.backend.controller;

import com.oms.backend.dto.request.CreateInvoiceRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.InvoiceResponse;
import com.oms.backend.model.Invoice;
import com.oms.backend.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    // POST /api/invoices/{orderId}
    @PostMapping("/{orderId}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(
            @PathVariable UUID orderId,
            @Valid @RequestBody CreateInvoiceRequest request) {

        Invoice invoice = invoiceService.createInvoice(
                orderId,
                request.getAmount(),
                request.getTaxAmount(),
                request.getDueDate()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Invoice created successfully",
                        InvoiceResponse.from(invoice)));
    }

    // GET /api/invoices
    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllInvoices() {

        List<InvoiceResponse> invoices = invoiceService.getAllInvoices()
                .stream()
                .map(InvoiceResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Invoices fetched successfully", invoices)
        );
    }

    // GET /api/invoices/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(
            @PathVariable UUID id) {

        Invoice invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Invoice fetched successfully", InvoiceResponse.from(invoice))
        );
    }

    // GET /api/invoices/order/{orderId}
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceByOrder(
            @PathVariable UUID orderId) {

        Invoice invoice = invoiceService.getInvoiceByOrder(orderId);
        return ResponseEntity.ok(
                ApiResponse.success("Invoice fetched successfully", InvoiceResponse.from(invoice))
        );
    }

    // GET /api/invoices/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByStatus(
            @PathVariable Invoice.InvoiceStatus status) {

        List<InvoiceResponse> invoices = invoiceService.getInvoicesByStatus(status)
                .stream()
                .map(InvoiceResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Invoices fetched successfully", invoices)
        );
    }

    // GET /api/invoices/summary
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getFinancialSummary() {
        return ResponseEntity.ok(
                ApiResponse.success("Financial summary fetched",
                        invoiceService.getFinancialSummary())
        );
    }
}