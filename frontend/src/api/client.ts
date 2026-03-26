const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = text ? JSON.parse(text) : {};
      message = data.error || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  async getEquipment() {
    const res = await fetch(`${API_BASE}/equipment`);
    return handleResponse<Equipment[]>(res);
  },

  async getEquipmentById(id: number) {
    const res = await fetch(`${API_BASE}/equipment/${id}`);
    return handleResponse<Equipment>(res);
  },

  async createEquipment(data: EquipmentCreateUpdate) {
    const res = await fetch(`${API_BASE}/equipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Equipment>(res);
  },

  async updateEquipment(id: number, data: EquipmentCreateUpdate) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Equipment>(res);
  },

  async deleteEquipment(id: number) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, { method: "DELETE" });
    if (res.status !== 204) await handleResponse<unknown>(res);
  },

  async getEquipmentTypes() {
    const res = await fetch(`${API_BASE}/equipment-types`);
    return handleResponse<EquipmentType[]>(res);
  },

  async createMaintenance(data: MaintenanceCreate) {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MaintenanceLog>(res);
  },

  async getMaintenanceByEquipmentId(equipmentId: number) {
    const res = await fetch(`${API_BASE}/equipment/${equipmentId}/maintenance`);
    return handleResponse<MaintenanceLog[]>(res);
  },
};

export interface EquipmentType {
  id: number;
  name: string;
}

export interface Equipment {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  status: string;
  lastCleanedDate: string | null;
}

export interface EquipmentCreateUpdate {
  name: string;
  typeId: number;
  status: string;
  lastCleanedDate: string | null;
}

export interface MaintenanceLog {
  id: number;
  equipmentId: number;
  maintenanceDate: string;
  notes: string | null;
  performedBy: string;
}

export interface MaintenanceCreate {
  equipmentId: number;
  maintenanceDate: string;
  notes?: string;
  performedBy: string;
}
