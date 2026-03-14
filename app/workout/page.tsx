import { getActivePhase, getNextWorkoutDay, getExerciseHistory } from "@/lib/queries";
import { exercises, plan_exercises } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { WorkoutTracker } from "@/components/workout/WorkoutTracker";

export default async function WorkoutPage() {
  const activePhase = await getActivePhase();
  const nextDay = await getNextWorkoutDay();

  // Fetch all planned exercises for this day
  const planned = await db.select().from(plan_exercises)
    .where(eq(plan_exercises.training_day_id, nextDay.id))
    .innerJoin(exercises, eq(plan_exercises.exercise_id, exercises.id));
    
  // Sort them
  planned.sort((a, b) => a.plan_exercises.sort_order - b.plan_exercises.sort_order);

  // Fetch recent history for these exercises to show suggestions
  const exIds = planned.map(p => p.exercises.id);
  const suggestions: Record<number, { w?: number, r?: number }> = {};
  
  for (const id of exIds) {
    const history = await getExerciseHistory(id);
    if (history.length > 0) {
      // get the best or last set weight
      const lastSession = history.filter(h => h.workout_logs.id === history[0].workout_logs.id);
      const bestSet = lastSession.reduce((prev, current) => ((prev.workout_sets?.weight_kg || 0) > (current.workout_sets?.weight_kg || 0)) ? prev : current, lastSession[0]);
      suggestions[id] = { w: bestSet.workout_sets?.weight_kg || undefined, r: bestSet.workout_sets?.reps || undefined };
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b-[3px] border-brutal pb-6">
        <h1 className="font-display text-5xl uppercase leading-none">Workout: {nextDay.day_label} - {nextDay.day_name}</h1>
        <p className="font-mono mt-4 uppercase">Phase {activePhase?.phase_number} | {nextDay.target_muscles}</p>
      </div>

      <WorkoutTracker 
        dayId={nextDay.id}
        exercises={planned.map(p => ({
          ...p.plan_exercises,
          exercise: p.exercises,
          suggestion: suggestions[p.exercises.id]
        }))}
      />
    </div>
  );
}
