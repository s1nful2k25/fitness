import { db } from "@/db";
import { exercises } from "@/db/schema";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function ExercisesPage() {
  const allExercises = await db.select().from(exercises).orderBy(exercises.name);

  // Group by muscle group
  const grouped = allExercises.reduce((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = [];
    acc[ex.muscle_group].push(ex);
    return acc;
  }, {} as Record<string, typeof allExercises>);

  const muscleLabels: Record<string, string> = {
    chest: "Brust",
    shoulders: "Schultern",
    triceps: "Trizeps",
    back: "Rücken",
    biceps: "Bizeps",
    rear_delt: "Hintere Schulter",
    quads: "Quadrizeps",
    hamstrings: "Beinbeuger",
    glutes: "Gesäß",
    calves: "Waden",
    core: "Bauch/Core"
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="border-b-[3px] border-brutal pb-6">
        <h1 className="font-display text-6xl uppercase leading-none">Übungskatalog</h1>
      </div>

      <div className="flex flex-col gap-16">
        {Object.entries(grouped).map(([muscle, list]) => (
          <div key={muscle} className="flex flex-col gap-6">
            <h2 className="font-display text-4xl uppercase underline decoration-[3px] underline-offset-8">
              {muscleLabels[muscle] || muscle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map(ex => (
                <Card key={ex.id} className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-2xl uppercase">{ex.name}</h3>
                  </div>
                  <div className="font-mono text-sm leading-relaxed border-t-[2px] border-brutal border-dashed pt-4 flex-1">
                    {ex.notes || "Keine besonderen Hinweise."}
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline">{ex.equipment?.replace('_', ' ') || 'Körpergewicht'}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
