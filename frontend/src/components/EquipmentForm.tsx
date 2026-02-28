import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Equipment, EquipmentCreateUpdate, EquipmentType } from "@/api/client";

const STATUS_OPTIONS = ["Active", "Inactive", "Under Maintenance"];

interface EquipmentFormProps {
  equipmentTypes: EquipmentType[];
  initial?: Equipment | null;
  onSubmit: (data: EquipmentCreateUpdate) => Promise<void>;
  onCancel: () => void;
}

export function EquipmentForm({
  equipmentTypes,
  initial,
  onSubmit,
  onCancel,
}: EquipmentFormProps) {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [lastCleanedDate, setLastCleanedDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setTypeId(String(initial.typeId));
      setStatus(initial.status);
      setLastCleanedDate(initial.lastCleanedDate ?? "");
    } else {
      setName("");
      setTypeId("");
      setStatus("");
      setLastCleanedDate("");
    }
    setErrors({});
    setApiError(null);
  }, [initial]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!typeId) next.typeId = "Type is required";
    if (!status) next.status = "Status is required";
    if (status === "Active" && !lastCleanedDate.trim()) {
      next.lastCleanedDate = "Last Cleaned Date is required when status is Active";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        typeId: Number(typeId),
        status,
        lastCleanedDate: lastCleanedDate.trim() || null,
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {apiError}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="equipment-name">Name</Label>
        <Input
          id="equipment-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Equipment name"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={typeId} onValueChange={setTypeId}>
          <SelectTrigger className={errors.typeId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {equipmentTypes.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.typeId && (
          <p className="text-sm text-destructive">{errors.typeId}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={errors.status ? "border-destructive" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="last-cleaned">Last Cleaned Date</Label>
        <Input
          id="last-cleaned"
          type="date"
          value={lastCleanedDate}
          onChange={(e) => setLastCleanedDate(e.target.value)}
          className={errors.lastCleanedDate ? "border-destructive" : ""}
        />
        {errors.lastCleanedDate && (
          <p className="text-sm text-destructive">{errors.lastCleanedDate}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {initial ? "Update" : "Add"} Equipment
        </Button>
      </div>
    </form>
  );
}
