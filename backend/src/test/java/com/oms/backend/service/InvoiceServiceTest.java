package com.oms.backend.service;

import com.oms.backend.exception.DuplicateResourceException;
import com.oms.backend.model.Invoice;
import com.oms.backend.model.Order;
import com.oms.backend.model.User;
import com.oms.backend.repository.InvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private InvoiceService invoiceService;

    private Order testOrder;
    private UUID orderId;

    @BeforeEach
    void setUp() {
        orderId = UUID.randomUUID();

        testOrder = Order.builder()
                .id(orderId)
                .customerName("ABC Corp")
                .productName("UPS Machine")
                .quantity(5)
                .status(Order.OrderStatus.DISPATCHED)
                .build();
    }

    // Test 1: Cannot invoice a PENDING order
    @Test
    void createInvoice_OrderPending_ThrowsException() {
        testOrder.setStatus(Order.OrderStatus.PENDING);
        when(orderService.getOrderById(orderId)).thenReturn(testOrder);

        assertThrows(IllegalStateException.class, () -> {
            invoiceService.createInvoice(
                    orderId, new BigDecimal("50000"),
                    new BigDecimal("9000"), LocalDate.now().plusDays(30)
            );
        });
    }

    // Test 2: Cannot invoice a CANCELLED order
    @Test
    void createInvoice_OrderCancelled_ThrowsException() {
        testOrder.setStatus(Order.OrderStatus.CANCELLED);
        when(orderService.getOrderById(orderId)).thenReturn(testOrder);

        assertThrows(IllegalStateException.class, () -> {
            invoiceService.createInvoice(
                    orderId, new BigDecimal("50000"),
                    null, null
            );
        });
    }

    // Test 3: Cannot create duplicate invoice for same order
    @Test
    void createInvoice_AlreadyExists_ThrowsException() {
        when(orderService.getOrderById(orderId)).thenReturn(testOrder);
        when(invoiceRepository.existsByOrder(testOrder)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            invoiceService.createInvoice(
                    orderId, new BigDecimal("50000"),
                    new BigDecimal("9000"), LocalDate.now().plusDays(30)
            );
        });
    }

    // Test 4: Invoice created successfully
    @Test
    void createInvoice_Success() {
        Invoice mockInvoice = Invoice.builder()
                .id(UUID.randomUUID())
                .order(testOrder)
                .amount(new BigDecimal("50000"))
                .taxAmount(new BigDecimal("9000"))
                .totalAmount(new BigDecimal("59000"))
                .status(Invoice.InvoiceStatus.UNPAID)
                .build();

        when(orderService.getOrderById(orderId)).thenReturn(testOrder);
        when(invoiceRepository.existsByOrder(testOrder)).thenReturn(false);
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(mockInvoice);

        Invoice result = invoiceService.createInvoice(
                orderId, new BigDecimal("50000"),
                new BigDecimal("9000"), LocalDate.now().plusDays(30)
        );

        assertNotNull(result);
        assertEquals(new BigDecimal("59000"), result.getTotalAmount());
        assertEquals(Invoice.InvoiceStatus.UNPAID, result.getStatus());
    }
}