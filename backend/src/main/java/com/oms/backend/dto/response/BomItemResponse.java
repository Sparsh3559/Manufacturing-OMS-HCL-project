package com.oms.backend.dto.response;

import com.oms.backend.model.BomItem;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class BomItemResponse {

    private UUID id;
    private UUID orderId;
    private String partName;
    private String partNumber;
    private Integer quantityRequired;
    private String unit;
    private String description;

    public static BomItemResponse from(BomItem item) {
        BomItemResponse response = new BomItemResponse();
        response.setId(item.getId());
        response.setOrderId(item.getOrder().getId());
        response.setPartName(item.getPartName());
        response.setPartNumber(item.getPartNumber());
        response.setQuantityRequired(item.getQuantityRequired());
        response.setUnit(item.getUnit());
        response.setDescription(item.getDescription());
        return response;
    }
}
