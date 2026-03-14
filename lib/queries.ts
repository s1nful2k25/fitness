import { db } from '@/db';
import { exercises, phases, training_days, plan_exercises, workout_logs, workout_sets, body_tracking } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getActivePhase() {
  // Simplification: We just return phase 1 if no logs exist, or derive it.
  // Real logic would calculate weeks since first workout. Let's assume manual or just fetch all for now.
  const allPhases = await db.select().from(phases).orderBy(phases.phase_number);
  return allPhases[0]; // Currently defaulting to 1 for MVP
}

export async function getPhasesWithDays() {
  const allPhases = await db.select().from(phases).orderBy(phases.phase_number);
  const allDays = await db.select().from(training_days);
  const allPlanEx = await db.select().from(plan_exercises).orderBy(plan_exercises.sort_order);
  const allExercises = await db.select().from(exercises);

  return allPhases.map(p => ({
    ...p,
    days: allDays.filter(d => d.phase_id === p.id).map(d => ({
      ...d,
      exercises: allPlanEx.filter(pe => pe.training_day_id === d.id).map(pe => {
        const ex = allExercises.find(e => e.id === pe.exercise_id);
        return { ...pe, exercise: ex };
      })
    }))
  }));
}

export async function getNextWorkoutDay() {
  const lastLog = await db.select().from(workout_logs).orderBy(desc(workout_logs.date)).limit(1);
  const allDays = await db.select().from(training_days);
  
  if (!lastLog.length) {
    return allDays[0];
  }

  // Find next day in the cycle
  const lastDay = allDays.find(d => d.id === lastLog[0].training_day_id);
  if (!lastDay) return allDays[0];

  const phaseDays = allDays.filter(d => d.phase_id === lastDay.phase_id);
  const idx = phaseDays.findIndex(d => d.id === lastDay.id);
  
  return phaseDays[(idx + 1) % phaseDays.length];
}

export async function getWorkoutHistory() {
  const logs = await db.select().from(workout_logs).orderBy(desc(workout_logs.date));
  const allDays = await db.select().from(training_days);
  return logs.map(l => ({
    ...l,
    day: allDays.find(d => d.id === l.training_day_id)
  }));
}

export async function getWorkoutLogDetails(logId: number) {
  const log = await db.select().from(workout_logs).where(eq(workout_logs.id, logId)).limit(1);
  if (!log.length) return null;

  const sets = await db.select().from(workout_sets).where(eq(workout_sets.workout_log_id, logId)).orderBy(workout_sets.set_number);
  const allExercises = await db.select().from(exercises);
  
  return {
    ...log[0],
    sets: sets.map(s => ({
      ...s,
      exercise: allExercises.find(e => e.id === s.exercise_id)
    }))
  };
}

export async function getBodyTrackingHistory() {
  return await db.select().from(body_tracking).orderBy(desc(body_tracking.date));
}

export async function getExerciseHistory(exerciseId: number) {
  return await db.select().from(workout_sets)
    .where(eq(workout_sets.exercise_id, exerciseId))
    .innerJoin(workout_logs, eq(workout_sets.workout_log_id, workout_logs.id))
    .orderBy(desc(workout_logs.date));
}
