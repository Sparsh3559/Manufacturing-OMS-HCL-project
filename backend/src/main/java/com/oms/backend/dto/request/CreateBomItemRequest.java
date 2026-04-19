package com.oms.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBomItemRequest {

    @NotBlank(message = "Part name is required")
    private String partName;

    @NotBlank(message = "Part number is required")
    private String partNumber;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantityRequired;

    private String unit;
    private String description;
}