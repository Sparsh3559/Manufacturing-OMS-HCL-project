package com.oms.backend.controller;

import com.oms.backend.dto.request.CreatePaymentRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.PaymentResponse;
import com.oms.backend.model.Payment;
import com.oms.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payments/{invoiceId}
    @PostMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> recordPayment(
            @PathVariable UUID invoiceId,
            @Valid @RequestBody CreatePaymentRequest request) {

        Payment payment = paymentService.recordPayment(
                invoiceId,
                request.getAmountPaid(),
                request.getPaymentMethod(),
                request.getReferenceNumber(),
                request.getRemarks()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment recorded successfully",
                        PaymentResponse.from(payment)));
    }

    // GET /api/payments/invoice/{invoiceId}
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByInvoice(
            @PathVariable UUID invoiceId) {

        List<PaymentResponse> payments = paymentService.getPaymentsByInvoice(invoiceId)
                .stream()
                .map(PaymentResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Payments fetched successfully", payments)
        );
    }

    // GET /api/payments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
            @PathVariable UUID id) {

        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Payment fetched successfully", PaymentResponse.from(payment))
        );
    }

    // GET /api/payments/invoice/{invoiceId}/balance
    // How much is still owed
    @GetMapping("/invoice/{invoiceId}/balance")
    public ResponseEntity<ApiResponse<BigDecimal>> getRemainingBalance(
            @PathVariable UUID invoiceId) {

        BigDecimal balance = paymentService.getRemainingBalance(invoiceId);
        return ResponseEntity.ok(
                ApiResponse.success("Remaining balance fetched", balance)
        );
    }
}