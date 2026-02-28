package com.equipment.dto;

import com.equipment.entity.Equipment;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentDto {
    private Long id;
    private String name;
    private Long typeId;
    private String typeName;
    private String status;
    private LocalDate lastCleanedDate;
}
