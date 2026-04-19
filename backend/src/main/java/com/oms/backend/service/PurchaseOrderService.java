package com.oms.backend.service;

import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.Order;
import com.oms.backend.model.PurchaseOrder;
import com.oms.backend.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final OrderService orderService;

    // Raise a purchase order to a supplier for parts needed
    @Transactional
    public PurchaseOrder createPurchaseOrder(UUID orderId,
                                             String supplierName,
                                             String supplierEmail,
                                             String supplierPhone,
                                             BigDecimal totalAmount,
                                             LocalDate expectedDelivery,
                                             String remarks) {

        Order order = orderService.getOrderById(orderId);

        // Business rule: can only raise PO when order is PROCESSING or PENDING
        if (order.getStatus() == Order.OrderStatus.DELIVERED
                || order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot raise purchase order for a " + order.getStatus() + " order"
            );
        }

        PurchaseOrder po = PurchaseOrder.builder()
                .order(order)
                .supplierName(supplierName)
                .supplierEmail(supplierEmail)
                .supplierPhone(supplierPhone)
                .totalAmount(totalAmount)
                .expectedDelivery(expectedDelivery)
                .status(PurchaseOrder.PurchaseOrderStatus.RAISED)
                .remarks(remarks)
                .build();

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        log.info("Purchase order {} raised for supplier: {}", saved.getId(), supplierName);

        // When a PO is raised, move the sales order to PROCESSING
        // This tells everyone that procurement has started
        if (order.getStatus() == Order.OrderStatus.PENDING) {
            orderService.updateOrderStatus(orderId, Order.OrderStatus.PROCESSING);
        }

        return saved;
    }

    // Get a single PO
    public PurchaseOrder getPurchaseOrderById(UUID id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + id));
    }

    // All POs for a sales order
    public List<PurchaseOrder> getPurchaseOrdersByOrder(UUID orderId) {
        Order order = orderService.getOrderById(orderId);
        return purchaseOrderRepository.findByOrder(order);
    }

    // All POs across the system — for the purchase officer dashboard
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    // Filter by status
    public List<PurchaseOrder> getPurchaseOrdersByStatus(PurchaseOrder.PurchaseOrderStatus status) {
        return purchaseOrderRepository.findByStatus(status);
    }

    // Get all overdue POs — expected delivery passed, not yet delivered
    public List<PurchaseOrder> getOverduePurchaseOrders() {
        return purchaseOrderRepository.findByExpectedDeliveryBeforeAndStatusNot(
                LocalDate.now(),
                PurchaseOrder.PurchaseOrderStatus.DELIVERED
        );
    }

    // Update PO status as it moves through the lifecycle
    @Transactional
    public PurchaseOrder updatePurchaseOrderStatus(UUID id,
                                                   PurchaseOrder.PurchaseOrderStatus newStatus,
                                                   LocalDate actualDelivery) {

        PurchaseOrder po = getPurchaseOrderById(id);

        // Cannot update a cancelled PO
        if (po.getStatus() == PurchaseOrder.PurchaseOrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update a cancelled purchase order");
        }

        po.setStatus(newStatus);

        // Record actual delivery date when marking as delivered
        if (newStatus == PurchaseOrder.PurchaseOrderStatus.DELIVERED && actualDelivery != null) {
            po.setActualDelivery(actualDelivery);
            log.info("Purchase order {} marked as delivered on {}", id, actualDelivery);
        }

        return purchaseOrderRepository.save(po);
    }

    // Cancel a purchase order
    @Transactional
    public PurchaseOrder cancelPurchaseOrder(UUID id) {
        PurchaseOrder po = getPurchaseOrderById(id);

        if (po.getStatus() == PurchaseOrder.PurchaseOrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel an already delivered purchase order");
        }

        po.setStatus(PurchaseOrder.PurchaseOrderStatus.CANCELLED);
        log.info("Purchase order {} cancelled", id);
        return purchaseOrderRepository.save(po);
    }

    // Count POs by status — for dashboard
    public Map<String, Long> getPurchaseOrderStatusCounts() {
        return Map.of(
                "raised",        purchaseOrderRepository.countByStatus(PurchaseOrder.PurchaseOrderStatus.RAISED),
                "acknowledged",  purchaseOrderRepository.countByStatus(PurchaseOrder.PurchaseOrderStatus.ACKNOWLEDGED),
                "shipped",       purchaseOrderRepository.countByStatus(PurchaseOrder.PurchaseOrderStatus.SHIPPED),
                "delivered",     purchaseOrderRepository.countByStatus(PurchaseOrder.PurchaseOrderStatus.DELIVERED),
                "cancelled",     purchaseOrderRepository.countByStatus(PurchaseOrder.PurchaseOrderStatus.CANCELLED)
        );
    }
}