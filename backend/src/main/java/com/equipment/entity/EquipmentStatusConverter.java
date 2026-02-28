package com.equipment.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EquipmentStatusConverter implements AttributeConverter<Equipment.EquipmentStatus, String> {

    @Override
    public String convertToDatabaseColumn(Equipment.EquipmentStatus status) {
        if (status == null) return null;
        return status.getDbValue();
    }

    @Override
    public Equipment.EquipmentStatus convertToEntityAttribute(String dbValue) {
        if (dbValue == null || dbValue.isBlank()) return null;
        return Equipment.EquipmentStatus.fromDbValue(dbValue);
    }
}
