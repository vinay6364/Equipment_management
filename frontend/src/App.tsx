import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentTable } from "@/components/EquipmentTable";
import { api, type Equipment, type EquipmentType } from "@/api/client";

function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [equipmentRes, typesRes] = await Promise.all([
        api.getEquipment(),
        api.getEquipmentTypes(),
      ]);
      setEquipment(equipmentRes);
      setTypes(typesRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Equipment Management</CardTitle>
            <Button variant="outline" onClick={() => load()}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <EquipmentTable
              equipmentList={equipment}
              equipmentTypes={types}
              loading={loading}
              error={error}
              onRefresh={load}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
