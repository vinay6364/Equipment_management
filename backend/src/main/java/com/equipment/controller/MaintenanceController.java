package com.equipment.controller;

import com.equipment.dto.MaintenanceCreateDto;
import com.equipment.dto.MaintenanceLogDto;
import com.equipment.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/maintenance")
    public ResponseEntity<MaintenanceLogDto> create(@Valid @RequestBody MaintenanceCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.create(dto));
    }

    @GetMapping("/equipment/{id}/maintenance")
    public ResponseEntity<List<MaintenanceLogDto>> getByEquipmentId(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.findByEquipmentId(id));
    }
}
