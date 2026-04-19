package com.oms.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "bom_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BomItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "part_name", nullable = false, length = 200)
    private String partName;

    @Column(name = "part_number", nullable = false, length = 100)
    private String partNumber;

    @Column(name = "quantity_required", nullable = false)
    private Integer quantityRequired;

    @Column(name = "unit", length = 50)
    private String unit = "pcs";

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}