-- Equipment Management System - PostgreSQL Schema
-- Equipment types are stored in DB so they can be modified without code changes.

-- Equipment types (dynamic, manageable via DB)
CREATE TABLE IF NOT EXISTS equipment_type (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Equipment (references equipment_type)
CREATE TABLE IF NOT EXISTS equipment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id BIGINT NOT NULL REFERENCES equipment_type(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance logs (reference equipment)
CREATE TABLE IF NOT EXISTS maintenance_log (
    id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL,
    notes TEXT,
    performed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipment_type_id ON equipment(type_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_maintenance_equipment_id ON maintenance_log(equipment_id);

-- Seed default equipment types (can be added/edited via DB later)
INSERT INTO equipment_type (name) VALUES
    ('Lab Equipment'),
    ('Office Equipment'),
    ('Industrial Machinery'),
    ('Medical Device'),
    ('IT Hardware')
ON CONFLICT (name) DO NOTHING;
