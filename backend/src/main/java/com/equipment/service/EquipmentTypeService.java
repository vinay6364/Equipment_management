package com.equipment.service;

import com.equipment.dto.EquipmentTypeDto;
import com.equipment.entity.EquipmentType;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentTypeService {

    private final EquipmentTypeRepository equipmentTypeRepository;

    @Transactional(readOnly = true)
    public List<EquipmentTypeDto> findAll() {
        return equipmentTypeRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private EquipmentTypeDto toDto(EquipmentType entity) {
        return EquipmentTypeDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
