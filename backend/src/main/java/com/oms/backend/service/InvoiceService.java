package com.oms.backend.service;

import com.oms.backend.exception.DuplicateResourceException;
import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.Invoice;
import com.oms.backend.model.Order;
import com.oms.backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderService orderService;

    // Counter for generating sequential invoice numbers
    // In production this would come from DB — fine for now
    private final AtomicInteger invoiceCounter = new AtomicInteger(
            (int) System.currentTimeMillis() % 1000
    );

    // Generate a unique invoice number like INV-2025-04-001
    private String generateInvoiceNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        int sequence = invoiceCounter.incrementAndGet();
        return String.format("INV-%s-%03d", datePart, sequence);
    }

    // Create an invoice for an order
    @Transactional
    public Invoice createInvoice(UUID orderId,
                                 BigDecimal amount,
                                 BigDecimal taxAmount,
                                 LocalDate dueDate) {

        Order order = orderService.getOrderById(orderId);

        // Business rule: can only invoice a DISPATCHED or DELIVERED order
        if (order.getStatus() == Order.OrderStatus.PENDING
                || order.getStatus() == Order.OrderStatus.PROCESSING) {
            throw new IllegalStateException(
                    "Cannot create invoice for an order that is still " + order.getStatus()
            );
        }

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot create invoice for a cancelled order");
        }

        // Business rule: one order, one invoice
        if (invoiceRepository.existsByOrder(order)) {
            throw new DuplicateResourceException(
                    "Invoice already exists for order: " + orderId
            );
        }

        // Calculate total
        BigDecimal tax = taxAmount != null ? taxAmount : BigDecimal.ZERO;
        BigDecimal total = amount.add(tax);

        Invoice invoice = Invoice.builder()
                .order(order)
                .invoiceNumber(generateInvoiceNumber())
                .amount(amount)
                .taxAmount(tax)
                .totalAmount(total)
                .status(Invoice.InvoiceStatus.UNPAID)
                .dueDate(dueDate != null ? dueDate : LocalDate.now().plusDays(30))
                .build();

        Invoice saved = invoiceRepository.save(invoice);
        log.info("Invoice {} created for order {}", saved.getInvoiceNumber(), orderId);
        return saved;
    }

    // Get a single invoice
    public Invoice getInvoiceById(UUID id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    // Get invoice by its readable number like INV-2025-04-001
    public Invoice getInvoiceByNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invoice not found with number: " + invoiceNumber
                ));
    }

    // Get the invoice for a specific order
    public Invoice getInvoiceByOrder(UUID orderId) {
        Order order = orderService.getOrderById(orderId);
        return invoiceRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No invoice found for order: " + orderId
                ));
    }

    // Get all invoices
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Get invoices by status — e.g. all UNPAID for follow-up
    public List<Invoice> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }

    // Update invoice status
    // Called automatically by PaymentService when payments come in
    @Transactional
    public Invoice updateInvoiceStatus(UUID id, Invoice.InvoiceStatus newStatus) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(newStatus);
        return invoiceRepository.save(invoice);
    }

    // Financial summary for the dashboard
    public Map<String, BigDecimal> getFinancialSummary() {
        return Map.of(
                "totalRevenue",    invoiceRepository.getTotalRevenue(),
                "totalPending",    invoiceRepository.getTotalPendingAmount()
        );
    }
}