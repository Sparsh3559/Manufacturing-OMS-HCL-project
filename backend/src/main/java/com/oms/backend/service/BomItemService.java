package com.oms.backend.service;

import com.oms.backend.exception.DuplicateResourceException;
import com.oms.backend.exception.ResourceNotFoundException;
import com.oms.backend.model.BomItem;
import com.oms.backend.model.Order;
import com.oms.backend.repository.BomItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BomItemService {

    private final BomItemRepository bomItemRepository;
    private final OrderService orderService;

    // Add a single part to an order's BOM
    @Transactional
    public BomItem addBomItem(UUID orderId,
                              String partName,
                              String partNumber,
                              Integer quantityRequired,
                              String unit,
                              String description) {

        Order order = orderService.getOrderById(orderId);

        // Business rule: BOM can only be created when order is PENDING or PROCESSING
        if (order.getStatus() == Order.OrderStatus.DELIVERED
                || order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot add BOM items to a " + order.getStatus() + " order"
            );
        }

        // Business rule: no duplicate part numbers in the same order's BOM
        if (bomItemRepository.existsByOrderAndPartNumber(order, partNumber)) {
            throw new DuplicateResourceException(
                    "Part number " + partNumber + " already exists in this order's BOM"
            );
        }

        BomItem item = BomItem.builder()
                .order(order)
                .partName(partName)
                .partNumber(partNumber)
                .quantityRequired(quantityRequired)
                .unit(unit != null ? unit : "pcs")
                .description(description)
                .build();

        BomItem saved = bomItemRepository.save(item);
        log.info("BOM item {} added to order {}", partNumber, orderId);
        return saved;
    }

    // Get the full BOM for an order
    public List<BomItem> getBomForOrder(UUID orderId) {
        Order order = orderService.getOrderById(orderId);
        return bomItemRepository.findByOrder(order);
    }

    // Get a single BOM item
    public BomItem getBomItemById(UUID id) {
        return bomItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BOM item not found with id: " + id));
    }

    // Update a BOM item's quantity or description
    @Transactional
    public BomItem updateBomItem(UUID id, Integer quantityRequired, String unit, String description) {
        BomItem item = getBomItemById(id);
        item.setQuantityRequired(quantityRequired);
        item.setUnit(unit);
        item.setDescription(description);
        return bomItemRepository.save(item);
    }

    // Remove a single part from the BOM
    @Transactional
    public void deleteBomItem(UUID id) {
        BomItem item = getBomItemById(id);
        bomItemRepository.delete(item);
        log.info("BOM item {} deleted", id);
    }

    // Clear the entire BOM for an order and rebuild it
    // Used when the order product changes completely
    @Transactional
    public void clearBomForOrder(UUID orderId) {
        Order order = orderService.getOrderById(orderId);
        bomItemRepository.deleteByOrder(order);
        log.info("All BOM items cleared for order {}", orderId);
    }
}