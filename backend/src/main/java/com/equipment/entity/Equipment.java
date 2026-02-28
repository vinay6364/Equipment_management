package com.equipment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private EquipmentType type;

    @Column(nullable = false, length = 50)
    @Convert(converter = EquipmentStatusConverter.class)
    private EquipmentStatus status;

    @Column(name = "last_cleaned_date")
    private LocalDate lastCleanedDate;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MaintenanceLog> maintenanceLogs = new ArrayList<>();

    public enum EquipmentStatus {
        Active("Active"),
        Inactive("Inactive"),
        Under_Maintenance("Under Maintenance");

        private final String dbValue;

        EquipmentStatus(String dbValue) {
            this.dbValue = dbValue;
        }

        public String getDbValue() {
            return dbValue;
        }

        public static EquipmentStatus fromDbValue(String dbValue) {
            for (EquipmentStatus s : values()) {
                if (s.dbValue.equals(dbValue)) return s;
            }
            throw new IllegalArgumentException("Unknown status: " + dbValue);
        }
    }
}
