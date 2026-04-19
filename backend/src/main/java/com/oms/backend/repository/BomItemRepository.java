package com.oms.backend.repository;

import com.oms.backend.model.BomItem;
import com.oms.backend.model.Order;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BomItemRepository extends JpaRepository<BomItem, UUID> {

    List<BomItem> findByOrder(Order order);

    List<BomItem> findByOrderId(UUID orderId);

    boolean existsByOrderAndPartNumber(Order order, String partNumber);

    @Transactional
    void deleteByOrder(Order order);
}