package com.equipment.service;

import com.equipment.dto.MaintenanceCreateDto;
import com.equipment.dto.MaintenanceLogDto;
import com.equipment.entity.Equipment;
import com.equipment.entity.MaintenanceLog;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.MaintenanceLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final EquipmentRepository equipmentRepository;

    /**
     * When a maintenance record is added:
     * - Equipment status must automatically change to Active
     * - Last Cleaned Date must update to the Maintenance Date
     */
    @Transactional
    public MaintenanceLogDto create(MaintenanceCreateDto dto) {
        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + dto.getEquipmentId()));
        MaintenanceLog log = MaintenanceLog.builder()
                .equipment(equipment)
                .maintenanceDate(dto.getMaintenanceDate())
                .notes(dto.getNotes())
                .performedBy(dto.getPerformedBy())
                .build();
        log = maintenanceLogRepository.save(log);
        equipment.setStatus(Equipment.EquipmentStatus.Active);
        equipment.setLastCleanedDate(dto.getMaintenanceDate());
        equipmentRepository.save(equipment);
        return toDto(log);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceLogDto> findByEquipmentId(Long equipmentId) {
        if (!equipmentRepository.existsById(equipmentId)) {
            throw new ResourceNotFoundException("Equipment not found with id: " + equipmentId);
        }
        return maintenanceLogRepository.findByEquipmentIdOrderByMaintenanceDateDesc(equipmentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private MaintenanceLogDto toDto(MaintenanceLog log) {
        return MaintenanceLogDto.builder()
                .id(log.getId())
                .equipmentId(log.getEquipment().getId())
                .maintenanceDate(log.getMaintenanceDate())
                .notes(log.getNotes())
                .performedBy(log.getPerformedBy())
                .build();
    }
}
