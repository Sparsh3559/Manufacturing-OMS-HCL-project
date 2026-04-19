package com.oms.backend.controller;

import com.oms.backend.dto.request.CreateBomItemRequest;
import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.dto.response.BomItemResponse;
import com.oms.backend.model.BomItem;
import com.oms.backend.service.BomItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders/{orderId}/bom")
@RequiredArgsConstructor
public class BomItemController {

    private final BomItemService bomItemService;

    // POST /api/orders/{orderId}/bom
    // Add a part to an order's BOM
    @PostMapping
    public ResponseEntity<ApiResponse<BomItemResponse>> addBomItem(
            @PathVariable UUID orderId,
            @Valid @RequestBody CreateBomItemRequest request) {

        BomItem item = bomItemService.addBomItem(
                orderId,
                request.getPartName(),
                request.getPartNumber(),
                request.getQuantityRequired(),
                request.getUnit(),
                request.getDescription()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("BOM item added successfully", BomItemResponse.from(item)));
    }

    // GET /api/orders/{orderId}/bom
    // Get full BOM for an order
    @GetMapping
    public ResponseEntity<ApiResponse<List<BomItemResponse>>> getBomForOrder(
            @PathVariable UUID orderId) {

        List<BomItemResponse> items = bomItemService.getBomForOrder(orderId)
                .stream()
                .map(BomItemResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("BOM fetched successfully", items)
        );
    }

    // DELETE /api/orders/{orderId}/bom/{itemId}
    // Remove a single part from the BOM
    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteBomItem(
            @PathVariable UUID orderId,
            @PathVariable UUID itemId) {

        bomItemService.deleteBomItem(itemId);
        return ResponseEntity.ok(ApiResponse.success("BOM item deleted successfully"));
    }

    // DELETE /api/orders/{orderId}/bom
    // Clear entire BOM for an order
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearBom(
            @PathVariable UUID orderId) {

        bomItemService.clearBomForOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("BOM cleared successfully"));
    }
}