package com.oms.backend.repository;

import com.oms.backend.model.Order;
import com.oms.backend.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {

    // All purchase orders linked to a sales order
    List<PurchaseOrder> findByOrder(Order order);

    // Filter by status - e.g. all RAISED purchase orders pending acknowledgement
    List<PurchaseOrder> findByStatus(PurchaseOrder.PurchaseOrderStatus status);

    // All POs from a specific supplier
    // Useful for supplier-wise reporting
    List<PurchaseOrder> findBySupplierNameContainingIgnoreCase(String supplierName);

    // Overdue purchase orders - expected delivery has passed but still not delivered
    List<PurchaseOrder> findByExpectedDeliveryBeforeAndStatusNot(
            LocalDate date,
            PurchaseOrder.PurchaseOrderStatus status
    );

    // Count POs by status - for dashboard
    long countByStatus(PurchaseOrder.PurchaseOrderStatus status);

    // All POs where actual delivery date is still null (not yet delivered)
    @Query("SELECT po FROM PurchaseOrder po WHERE po.actualDelivery IS NULL AND po.status != 'CANCELLED'")
    List<PurchaseOrder> findAllPending();
}