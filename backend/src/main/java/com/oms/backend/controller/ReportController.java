package com.oms.backend.controller;

import com.oms.backend.dto.response.ApiResponse;
import com.oms.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(
                ApiResponse.success("Dashboard data fetched",
                        reportService.getDashboardSummary())
        );
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getOrderReport() {
        return ResponseEntity.ok(
                ApiResponse.success("Order report fetched",
                        reportService.getOrderReport())
        );
    }

    // Fixed: return type matches service exactly
    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getRevenueReport() {
        return ResponseEntity.ok(
                ApiResponse.success("Revenue report fetched",
                        reportService.getRevenueReport())
        );
    }
}