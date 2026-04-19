package com.oms.backend.repository;

import com.oms.backend.model.Invoice;
import com.oms.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    // Get the invoice for a specific order
    // Returns Optional because an order might not have an invoice yet
    Optional<Invoice> findByOrder(Order order);

    // Find invoice by its human-readable number like "INV-2025-001"
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    // All invoices with a specific status
    // e.g. all UNPAID invoices for follow-up
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);

    // Check if an order already has an invoice
    // Prevents creating duplicate invoices for the same order
    boolean existsByOrder(Order order);

    // Total revenue collected - sum of all PAID invoice amounts
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status = 'PAID'")
    BigDecimal getTotalRevenue();

    // Total pending amount - sum of all UNPAID and PARTIALLY_PAID invoices
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status IN ('UNPAID', 'PARTIALLY_PAID')")
    BigDecimal getTotalPendingAmount();
}