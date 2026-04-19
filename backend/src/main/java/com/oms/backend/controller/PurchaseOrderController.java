package com.oms.backend.controller;

import com.oms.backend.dto.request.CreatePurchaseOrderRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.PurchaseOrderResponse;
import com.oms.backend.model.PurchaseOrder;
import com.oms.backend.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    // POST /api/purchase-orders/{orderId}
    @PostMapping("/{orderId}")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> createPurchaseOrder(
            @PathVariable UUID orderId,
            @Valid @RequestBody CreatePurchaseOrderRequest request) {

        PurchaseOrder po = purchaseOrderService.createPurchaseOrder(
                orderId,
                request.getSupplierName(),
                request.getSupplierEmail(),
                request.getSupplierPhone(),
                request.getTotalAmount(),
                request.getExpectedDelivery(),
                request.getRemarks()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Purchase order created successfully",
                        PurchaseOrderResponse.from(po)));
    }

    // GET /api/purchase-orders
    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getAllPurchaseOrders() {

        List<PurchaseOrderResponse> pos = purchaseOrderService.getAllPurchaseOrders()
                .stream()
                .map(PurchaseOrderResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Purchase orders fetched successfully", pos)
        );
    }

    // GET /api/purchase-orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> getPurchaseOrderById(
            @PathVariable UUID id) {

        PurchaseOrder po = purchaseOrderService.getPurchaseOrderById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Purchase order fetched successfully",
                        PurchaseOrderResponse.from(po))
        );
    }

    // GET /api/purchase-orders/order/{orderId}
    // All POs for a sales order
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getPurchaseOrdersByOrder(
            @PathVariable UUID orderId) {

        List<PurchaseOrderResponse> pos = purchaseOrderService.getPurchaseOrdersByOrder(orderId)
                .stream()
                .map(PurchaseOrderResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Purchase orders fetched successfully", pos)
        );
    }

    // GET /api/purchase-orders/overdue
    // All overdue POs
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getOverduePurchaseOrders() {

        List<PurchaseOrderResponse> pos = purchaseOrderService.getOverduePurchaseOrders()
                .stream()
                .map(PurchaseOrderResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Overdue purchase orders fetched", pos)
        );
    }

    // PATCH /api/purchase-orders/{id}/status?newStatus=DELIVERED
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam PurchaseOrder.PurchaseOrderStatus newStatus,
            @RequestParam(required = false) LocalDate actualDelivery) {

        PurchaseOrder po = purchaseOrderService.updatePurchaseOrderStatus(
                id, newStatus, actualDelivery
        );

        return ResponseEntity.ok(
                ApiResponse.success("Status updated successfully", PurchaseOrderResponse.from(po))
        );
    }

    // PATCH /api/purchase-orders/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> cancelPurchaseOrder(
            @PathVariable UUID id) {

        PurchaseOrder po = purchaseOrderService.cancelPurchaseOrder(id);
        return ResponseEntity.ok(
                ApiResponse.success("Purchase order cancelled", PurchaseOrderResponse.from(po))
        );
    }
}