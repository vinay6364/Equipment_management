package com.equipment.repository;

import com.equipment.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {

    List<MaintenanceLog> findByEquipmentIdOrderByMaintenanceDateDesc(Long equipmentId);
}
