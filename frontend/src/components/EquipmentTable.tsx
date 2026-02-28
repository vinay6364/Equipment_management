import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EquipmentForm } from "@/components/EquipmentForm";
import { MaintenanceHistoryDialog } from "@/components/MaintenanceHistoryDialog";
import { api, type Equipment, type EquipmentCreateUpdate, type EquipmentType } from "@/api/client";
import { Pencil, Trash2, Wrench } from "lucide-react";

interface EquipmentTableProps {
  equipmentList: Equipment[];
  equipmentTypes: EquipmentType[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function EquipmentTable({
  equipmentList,
  equipmentTypes,
  loading,
  error,
  onRefresh,
}: EquipmentTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [maintenanceEquipment, setMaintenanceEquipment] = useState<Equipment | null>(null);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleSubmit(data: EquipmentCreateUpdate) {
    if (editing) {
      await api.updateEquipment(editing.id, data);
    } else {
      await api.createEquipment(data);
    }
    setFormOpen(false);
    setEditing(null);
    onRefresh();
  }

  function openAddForm() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEditForm(equipment: Equipment) {
    setEditing(equipment);
    setFormOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this equipment?")) return;
    setDeletingId(id);
    try {
      await api.deleteEquipment(id);
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  }

  function openMaintenance(equipment: Equipment) {
    setMaintenanceEquipment(equipment);
    setMaintenanceOpen(true);
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading equipment...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={openAddForm}>Add equipment</Button>
        </div>
        <div className="rounded-md border">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Cleaned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipmentList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No equipment. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              equipmentList.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.name}</TableCell>
                  <TableCell>{eq.typeName}</TableCell>
                  <TableCell>{eq.status}</TableCell>
                  <TableCell>{eq.lastCleanedDate ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openMaintenance(eq)}
                        title="Maintenance history"
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditForm(eq)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(eq.id)}
                        disabled={deletingId === eq.id}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit equipment" : "Add equipment"}</DialogTitle>
          </DialogHeader>
          <EquipmentForm
            equipmentTypes={equipmentTypes}
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <MaintenanceHistoryDialog
        equipment={maintenanceEquipment}
        open={maintenanceOpen}
        onOpenChange={setMaintenanceOpen}
        onMaintenanceAdded={onRefresh}
      />
    </>
  );
}
