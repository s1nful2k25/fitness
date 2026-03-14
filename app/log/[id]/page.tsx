import { getWorkoutLogDetails, getExerciseHistory } from "@/lib/queries";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/Sparkline";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";

export default async function LogDetailPage({ params }: { params: { id: string } }) {
  const logId = parseInt(params.id, 10);
  if (isNaN(logId)) return notFound();

  const log = await getWorkoutLogDetails(logId);
  if (!log) return notFound();

  // Group sets by exercise
  const exercisesData: Record<number, typeof log.sets> = {};
  log.sets.forEach(set => {
    if (!exercisesData[set.exercise_id]) exercisesData[set.exercise_id] = [];
    exercisesData[set.exercise_id].push(set);
  });

  return (
    <div className="flex flex-col gap-12">
      <div className="border-b-[3px] border-brutal pb-6">
        <Link href="/log" className="font-mono text-sm uppercase underline mb-4 inline-block">← Zurück zum Logbuch</Link>
        <div className="flex justify-between items-end">
          <h1 className="font-display text-5xl uppercase leading-none">Workout Details</h1>
        </div>
        <div className="font-mono mt-4 opacity-70">
          Dauer: {log.duration_min} Minuten | Datum: {new Date(log.date).toLocaleString('de-DE')}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {Object.entries(exercisesData).map(([exIdStr, sets]) => {
          const exId = parseInt(exIdStr, 10);
          const exercise = sets[0].exercise;
          return <ExerciseDetailBlock key={exId} exercise={exercise} sets={sets} exerciseId={exId} />;
        })}
      </div>
    </div>
  );
}

// Subcomponent to fetch and render history chart per exercise
async function ExerciseDetailBlock({ exercise, sets, exerciseId }: any) {
  const history = await getExerciseHistory(exerciseId);
  const reversed = [...history].reverse(); // Oldest to newest
  
  // Metric: Volume per session (sum of weight * reps)
  // Group history by workout_log_id
  const volumeByLog: Record<number, number> = {};
  reversed.forEach(h => {
    const vol = (h.workout_sets?.weight_kg || 0) * (h.workout_sets?.reps || 0);
    if (!volumeByLog[h.workout_logs.id]) volumeByLog[h.workout_logs.id] = 0;
    volumeByLog[h.workout_logs.id] += vol;
  });

  const volData = Object.values(volumeByLog);

  return (
    <Card className="!bg-white">
      <CardHeader className="flex flex-row justify-between items-center text-xl">
        <span>{exercise?.name}</span>
        {exercise?.equipment && <Badge variant="outline" className="text-sm">{exercise.equipment.replace('_', ' ')}</Badge>}
      </CardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="border-b-[3px] border-brutal">
                <th className="py-2">Satz</th>
                <th className="py-2">kg</th>
                <th className="py-2">Reps</th>
                <th className="py-2">RPE</th>
                <th className="py-2">Art</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((s: any) => (
                <tr key={s.id} className="border-b-[2px] border-brutal border-dashed last:border-0 hover:bg-gray-100">
                  <td className="py-2">{s.set_number}</td>
                  <td className="py-2">{s.weight_kg || '-'}</td>
                  <td className="py-2">{s.reps || '-'}</td>
                  <td className="py-2">{s.rpe || '-'}</td>
                  <td className="py-2 text-xs">
                    {s.is_drop_set && <span className="text-accent underline">Drop</span>}
                    {s.is_myo_set && <span className="text-accent underline">Myo</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col">
          <h4 className="font-mono text-sm uppercase underline mb-4">Volumen-Trend (Gewicht x Reps)</h4>
          <div className="h-32 border-[2px] border-brutal p-4 bg-gray-50 flex-1">
            <Sparkline data={volData} />
          </div>
        </div>
      </div>
    </Card>
  );
}
