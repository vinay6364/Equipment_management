package com.equipment.service;

import com.equipment.dto.EquipmentCreateUpdateDto;
import com.equipment.dto.EquipmentDto;
import com.equipment.entity.Equipment;
import com.equipment.entity.EquipmentType;
import com.equipment.exception.BusinessRuleException;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private static final int MAX_DAYS_SINCE_CLEANED_FOR_ACTIVE = 30;

    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;

    @Transactional(readOnly = true)
    public List<EquipmentDto> findAll() {
        return equipmentRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EquipmentDto findById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
        return toDto(equipment);
    }

    @Transactional
    public EquipmentDto create(EquipmentCreateUpdateDto dto) {
        validateActiveStatusConstraint(dto.getStatus(), dto.getLastCleanedDate(), null);
        EquipmentType type = equipmentTypeRepository.findById(dto.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + dto.getTypeId()));
        Equipment equipment = Equipment.builder()
                .name(dto.getName())
                .type(type)
                .status(Equipment.EquipmentStatus.fromDbValue(dto.getStatus()))
                .lastCleanedDate(dto.getLastCleanedDate())
                .build();
        equipment = equipmentRepository.save(equipment);
        return toDto(equipment);
    }

    @Transactional
    public EquipmentDto update(Long id, EquipmentCreateUpdateDto dto) {
        validateActiveStatusConstraint(dto.getStatus(), dto.getLastCleanedDate(), id);
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
        EquipmentType type = equipmentTypeRepository.findById(dto.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + dto.getTypeId()));
        equipment.setName(dto.getName());
        equipment.setType(type);
        equipment.setStatus(Equipment.EquipmentStatus.fromDbValue(dto.getStatus()));
        equipment.setLastCleanedDate(dto.getLastCleanedDate());
        equipment = equipmentRepository.save(equipment);
        return toDto(equipment);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipment not found with id: " + id);
        }
        equipmentRepository.deleteById(id);
    }

    /**
     * Business rule: Equipment cannot be marked "Active" if Last Cleaned Date is older than 30 days.
     */
    private void validateActiveStatusConstraint(String status, LocalDate lastCleanedDate, Long equipmentId) {
        if (!"Active".equals(status)) {
            return;
        }
        if (lastCleanedDate == null) {
            throw new BusinessRuleException(
                    "Equipment cannot be set to Active without a Last Cleaned Date. " +
                    "Please set Last Cleaned Date to within the last 30 days, or add a maintenance record.");
        }
        long daysSinceCleaned = ChronoUnit.DAYS.between(lastCleanedDate, LocalDate.now());
        if (daysSinceCleaned > MAX_DAYS_SINCE_CLEANED_FOR_ACTIVE) {
            throw new BusinessRuleException(
                    "Equipment cannot be set to Active when Last Cleaned Date is older than 30 days. " +
                    "Last cleaned: " + lastCleanedDate + " (" + daysSinceCleaned + " days ago). " +
                    "Please update Last Cleaned Date or add a maintenance record.");
        }
    }

    private EquipmentDto toDto(Equipment e) {
        return EquipmentDto.builder()
                .id(e.getId())
                .name(e.getName())
                .typeId(e.getType().getId())
                .typeName(e.getType().getName())
                .status(e.getStatus().getDbValue())
                .lastCleanedDate(e.getLastCleanedDate())
                .build();
    }
}
