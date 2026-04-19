package com.oms.backend.repository;

import com.oms.backend.model.Invoice;
import com.oms.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    // All payments made against a specific invoice
    // e.g. invoice total is 1,00,000 — show me all payments received
    List<Payment> findByInvoice(Invoice invoice);

    // Same but using invoice ID directly
    List<Payment> findByInvoiceId(UUID invoiceId);

    // Filter by payment method - e.g. all UPI payments this month
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);

    // Total amount already paid against a specific invoice
    // Used to calculate remaining balance and update invoice status
    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM Payment p WHERE p.invoice = :invoice")
    BigDecimal getTotalPaidForInvoice(@Param("invoice") Invoice invoice);

    // Total payments received overall - for the reports dashboard
    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM Payment p")
    BigDecimal getTotalPaymentsReceived();
}