package com.equipment.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceLogDto {
    private Long id;
    private Long equipmentId;
    private LocalDate maintenanceDate;
    private String notes;
    private String performedBy;
}
