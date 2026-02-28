import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type Equipment, type MaintenanceLog } from "@/api/client";

interface MaintenanceHistoryDialogProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaintenanceAdded: () => void;
}

export function MaintenanceHistoryDialog({
  equipment,
  open,
  onOpenChange,
  onMaintenanceAdded,
}: MaintenanceHistoryDialogProps) {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && equipment) {
      setLoading(true);
      api.getMaintenanceByEquipmentId(equipment.id).then(setLogs).finally(() => setLoading(false));
      setShowAdd(false);
      setAddError(null);
      setMaintenanceDate("");
      setNotes("");
      setPerformedBy("");
    }
  }, [open, equipment]);

  async function handleAddMaintenance(e: React.FormEvent) {
    e.preventDefault();
    if (!equipment) return;
    if (!maintenanceDate.trim() || !performedBy.trim()) return;
    setAddError(null);
    setSubmitting(true);
    try {
      await api.createMaintenance({
        equipmentId: equipment.id,
        maintenanceDate: maintenanceDate.trim(),
        notes: notes.trim() || undefined,
        performedBy: performedBy.trim(),
      });
      onMaintenanceAdded();
      const updated = await api.getMaintenanceByEquipmentId(equipment.id);
      setLogs(updated);
      setShowAdd(false);
      setMaintenanceDate("");
      setNotes("");
      setPerformedBy("");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add maintenance");
    } finally {
      setSubmitting(false);
    }
  }

  const title = equipment ? `Maintenance: ${equipment.name}` : "Maintenance history";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {equipment && (
          <>
            {!showAdd ? (
              <Button onClick={() => setShowAdd(true)} className="mb-4">
                Log maintenance
              </Button>
            ) : (
              <form onSubmit={handleAddMaintenance} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/30">
                {addError && (
                  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {addError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="maint-date">Maintenance Date</Label>
                  <Input
                    id="maint-date"
                    type="date"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maint-notes">Notes</Label>
                  <Input
                    id="maint-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maint-by">Performed By</Label>
                  <Input
                    id="maint-by"
                    value={performedBy}
                    onChange={(e) => setPerformedBy(e.target.value)}
                    placeholder="Name of person"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    Add maintenance
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            <div>
              <h4 className="font-medium mb-2">History</h4>
              {loading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : logs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No maintenance records yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.maintenanceDate}</TableCell>
                        <TableCell>{log.performedBy}</TableCell>
                        <TableCell>{log.notes ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
