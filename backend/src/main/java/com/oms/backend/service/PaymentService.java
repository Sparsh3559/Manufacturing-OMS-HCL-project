package com.oms.backend.service;

import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.Invoice;
import com.oms.backend.model.Payment;
import com.oms.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceService invoiceService;

    // Record a payment received against an invoice
    @Transactional
    public Payment recordPayment(UUID invoiceId,
                                 BigDecimal amountPaid,
                                 Payment.PaymentMethod paymentMethod,
                                 String referenceNumber,
                                 String remarks) {

        Invoice invoice = invoiceService.getInvoiceById(invoiceId);

        // Business rule: cannot accept payment for an already fully paid invoice
        if (invoice.getStatus() == Invoice.InvoiceStatus.PAID) {
            throw new IllegalStateException(
                    "Invoice " + invoice.getInvoiceNumber() + " is already fully paid"
            );
        }

        // Business rule: payment cannot exceed the invoice total
        BigDecimal alreadyPaid = paymentRepository.getTotalPaidForInvoice(invoice);
        BigDecimal remaining = invoice.getTotalAmount().subtract(alreadyPaid);

        if (amountPaid.compareTo(remaining) > 0) {
            throw new IllegalArgumentException(
                    "Payment amount " + amountPaid + " exceeds remaining balance of " + remaining
            );
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .amountPaid(amountPaid)
                .paymentMethod(paymentMethod)
                .referenceNumber(referenceNumber)
                .remarks(remarks)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment of {} recorded for invoice {}", amountPaid, invoice.getInvoiceNumber());

        // Automatically update invoice status based on how much has been paid
        updateInvoiceStatusAfterPayment(invoice, alreadyPaid.add(amountPaid));

        return saved;
    }

    // Automatically update invoice status after every payment
    // This keeps invoice status always accurate without manual updates
    private void updateInvoiceStatusAfterPayment(Invoice invoice, BigDecimal totalPaidSoFar) {
        int comparison = totalPaidSoFar.compareTo(invoice.getTotalAmount());

        if (comparison >= 0) {
            // Total paid equals or exceeds invoice total — fully paid
            invoiceService.updateInvoiceStatus(invoice.getId(), Invoice.InvoiceStatus.PAID);
            log.info("Invoice {} marked as PAID", invoice.getInvoiceNumber());
        } else {
            // Partial payment received
            invoiceService.updateInvoiceStatus(invoice.getId(), Invoice.InvoiceStatus.PARTIALLY_PAID);
            log.info("Invoice {} marked as PARTIALLY_PAID", invoice.getInvoiceNumber());
        }
    }

    // Get all payments for an invoice
    public List<Payment> getPaymentsByInvoice(UUID invoiceId) {
        Invoice invoice = invoiceService.getInvoiceById(invoiceId);
        return paymentRepository.findByInvoice(invoice);
    }

    // Get a single payment record
    public Payment getPaymentById(UUID id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    // Get all payments in the system
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // How much is still owed on an invoice
    public BigDecimal getRemainingBalance(UUID invoiceId) {
        Invoice invoice = invoiceService.getInvoiceById(invoiceId);
        BigDecimal paid = paymentRepository.getTotalPaidForInvoice(invoice);
        return invoice.getTotalAmount().subtract(paid);
    }

    // Total payments received overall — for dashboard
    public BigDecimal getTotalPaymentsReceived() {
        return paymentRepository.getTotalPaymentsReceived();
    }
}