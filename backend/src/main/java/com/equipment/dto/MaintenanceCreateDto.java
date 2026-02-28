package com.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceCreateDto {

    @NotNull(message = "Equipment is required")
    private Long equipmentId;

    @NotNull(message = "Maintenance date is required")
    private java.time.LocalDate maintenanceDate;

    private String notes;

    @NotBlank(message = "Performed by is required")
    private String performedBy;
}
