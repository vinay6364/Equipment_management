package com.equipment.repository;

import com.equipment.entity.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentTypeRepository extends JpaRepository<EquipmentType, Long> {

    List<EquipmentType> findAllByOrderByNameAsc();
}
