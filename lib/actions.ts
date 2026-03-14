"use server";

import { db } from '@/db';
import { workout_logs, workout_sets, body_tracking } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function logWorkoutAction(data: {
  training_day_id: number;
  duration_min: number;
  notes?: string;
  sets: {
    exercise_id: number;
    weight_kg?: number;
    reps?: number;
    rpe?: number;
    is_drop_set?: boolean;
    is_myo_set?: boolean;
  }[];
}) {
  const date = new Date().toISOString();
  
  const [log] = await db.insert(workout_logs).values({
    training_day_id: data.training_day_id,
    date,
    duration_min: data.duration_min,
    notes: data.notes,
  }).returning({ id: workout_logs.id });

  let setNumber = 1;
  for (const set of data.sets) {
    await db.insert(workout_sets).values({
      workout_log_id: log.id,
      exercise_id: set.exercise_id,
      set_number: setNumber++,
      weight_kg: set.weight_kg,
      reps: set.reps,
      rpe: set.rpe,
      is_drop_set: set.is_drop_set || false,
      is_myo_set: set.is_myo_set || false,
    });
  }

  revalidatePath('/');
  revalidatePath('/workout');
  revalidatePath('/log');
  return { success: true, logId: log.id };
}

export async function addBodyEntryAction(data: {
  body_weight_kg?: number;
  chest_cm?: number;
  arm_cm?: number;
  thigh_cm?: number;
  waist_cm?: number;
  notes?: string;
}) {
  const date = new Date().toISOString();

  await db.insert(body_tracking).values({
    date,
    ...data
  });

  revalidatePath('/');
  revalidatePath('/body');
  return { success: true };
}
