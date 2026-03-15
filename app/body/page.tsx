import { getBodyTrackingHistory } from "@/lib/queries";
import { addBodyEntryAction } from "@/lib/actions";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "@/components/Sparkline";
export const dynamic = "force-dynamic";
export default async function BodyTrackingPage() {
  const history = await getBodyTrackingHistory();
  const sortedHistory = [...history].reverse(); // oldest to newest for sparkline

  async function handleAdd(formData: FormData) {
    "use server";
    const bw = parseFloat(formData.get("bw") as string);
    const chest = parseFloat(formData.get("chest") as string);
    const arm = parseFloat(formData.get("arm") as string);
    const thigh = parseFloat(formData.get("thigh") as string);
    const waist = parseFloat(formData.get("waist") as string);
    const notes = formData.get("notes") as string;

    await addBodyEntryAction({
      body_weight_kg: isNaN(bw) ? undefined : bw,
      chest_cm: isNaN(chest) ? undefined : chest,
      arm_cm: isNaN(arm) ? undefined : arm,
      thigh_cm: isNaN(thigh) ? undefined : thigh,
      waist_cm: isNaN(waist) ? undefined : waist,
      notes: notes || undefined,
    });
  }

  const bwData = sortedHistory.filter(h => h.body_weight_kg).map(h => h.body_weight_kg!);
  const chestData = sortedHistory.filter(h => h.chest_cm).map(h => h.chest_cm!);
  const armData = sortedHistory.filter(h => h.arm_cm).map(h => h.arm_cm!);

  return (
    <div className="flex flex-col gap-12">
      <div className="border-b-[3px] border-brutal pb-6">
        <h1 className="font-display text-6xl uppercase leading-none">Körper Tracker</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card className="!bg-[var(--fg)] !text-[var(--bg)] border-[var(--fg)]">
          <CardHeader className="!bg-[var(--bg)] !text-[var(--fg)] !border-[var(--fg)]">Neue Messung</CardHeader>
          <form action={handleAdd} className="flex flex-col gap-6 font-mono">
            <div className="text-sm border-l-[3px] border-accent pl-4 mb-4">
              Wöchentlich: Körpergewicht (nüchtern)<br/>
              Alle 2 Wochen: Körpermaße
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input name="bw" type="number" step="0.1" label="Gewicht (kg)" className="bg-[var(--bg)] text-[var(--fg)]" />
              <Input name="chest" type="number" step="0.5" label="Brust (cm)" className="bg-[var(--bg)] text-[var(--fg)]" />
              <Input name="arm" type="number" step="0.5" label="Arm (cm)" className="bg-[var(--bg)] text-[var(--fg)]" />
              <Input name="thigh" type="number" step="0.5" label="Oberschenkel (cm)" className="bg-[var(--bg)] text-[var(--fg)]" />
              <Input name="waist" type="number" step="0.5" label="Taille (cm)" className="bg-[var(--bg)] text-[var(--fg)]" />
              <Input name="notes" type="text" label="Notiz (optional)" className="bg-[var(--bg)] text-[var(--fg)]" />
            </div>

            <Button type="submit" variant="primary" className="mt-4 border-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--fg)]" size="lg">Speichern</Button>
          </form>
        </Card>

        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>Gewicht</CardHeader>
            <div className="h-40 border-[2px] border-brutal p-4 bg-gray-50">
              <Sparkline data={bwData} />
            </div>
          </Card>

          <Card>
            <CardHeader>Brustumfang</CardHeader>
            <div className="h-32 border-[2px] border-brutal p-4 bg-gray-50">
              <Sparkline data={chestData} />
            </div>
          </Card>

          <Card>
            <CardHeader>Armumfang</CardHeader>
            <div className="h-32 border-[2px] border-brutal p-4 bg-gray-50">
              <Sparkline data={armData} />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
