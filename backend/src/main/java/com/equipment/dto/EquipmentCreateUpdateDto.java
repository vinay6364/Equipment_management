package com.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentCreateUpdateDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Equipment type is required")
    private Long typeId;

    @NotBlank(message = "Status is required")
    private String status;

    private java.time.LocalDate lastCleanedDate;
}
