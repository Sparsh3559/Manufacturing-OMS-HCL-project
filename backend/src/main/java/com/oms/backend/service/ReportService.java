package com.oms.backend.service;

import com.oms.backend.model.Order;
import com.oms.backend.repository.InvoiceRepository;
import com.oms.backend.repository.OrderRepository;
import com.oms.backend.repository.PaymentRepository;
import com.oms.backend.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    // Full dashboard summary in one call
    public Map<String, Object> getDashboardSummary() {
        return Map.of(
                "totalOrders",       orderRepository.count(),
                "pendingOrders",     orderRepository.countByStatus(Order.OrderStatus.PENDING),
                "processingOrders",  orderRepository.countByStatus(Order.OrderStatus.PROCESSING),
                "deliveredOrders",   orderRepository.countByStatus(Order.OrderStatus.DELIVERED),
                "totalRevenue",      invoiceRepository.getTotalRevenue(),
                "pendingPayments",   invoiceRepository.getTotalPendingAmount(),
                "overduePos",        purchaseOrderRepository.findAllPending().size()
        );
    }

    // Order counts by status
    public Map<String, Long> getOrderReport() {
        return Map.of(
                "pending",    orderRepository.countByStatus(Order.OrderStatus.PENDING),
                "processing", orderRepository.countByStatus(Order.OrderStatus.PROCESSING),
                "dispatched", orderRepository.countByStatus(Order.OrderStatus.DISPATCHED),
                "delivered",  orderRepository.countByStatus(Order.OrderStatus.DELIVERED),
                "cancelled",  orderRepository.countByStatus(Order.OrderStatus.CANCELLED)
        );
    }

    // Revenue summary
    public Map<String, BigDecimal> getRevenueReport() {
        return Map.of(
                "totalRevenue",  invoiceRepository.getTotalRevenue(),
                "totalPending",  invoiceRepository.getTotalPendingAmount(),
                "totalReceived", paymentRepository.getTotalPaymentsReceived()
        );
    }
}