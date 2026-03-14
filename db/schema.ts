import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  muscle_group: text('muscle_group').notNull(),
  equipment: text('equipment'),
  notes: text('notes'),
});

export const phases = sqliteTable('phases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phase_number: integer('phase_number').notNull(),
  name: text('name').notNull(),
  weeks: text('weeks').notNull(),
  focus: text('focus'),
  tempo: text('tempo'),
  rep_range: text('rep_range'),
});

export const training_days = sqliteTable('training_days', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phase_id: integer('phase_id').references(() => phases.id).notNull(),
  day_label: text('day_label').notNull(),
  day_name: text('day_name').notNull(),
  target_muscles: text('target_muscles'),
});

export const plan_exercises = sqliteTable('plan_exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  training_day_id: integer('training_day_id').references(() => training_days.id).notNull(),
  exercise_id: integer('exercise_id').references(() => exercises.id).notNull(),
  sets: text('sets').notNull(),
  reps: text('reps').notNull(),
  rest_seconds: integer('rest_seconds').notNull(),
  intensity_tech: text('intensity_tech'),
  superset_with: integer('superset_with'), // Self-referencing FK is fine as simple integer manually handled if preferred, or references()
  notes: text('notes'),
  sort_order: integer('sort_order').notNull(),
});

export const workout_logs = sqliteTable('workout_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  training_day_id: integer('training_day_id').references(() => training_days.id).notNull(),
  date: text('date').notNull(),
  duration_min: integer('duration_min'),
  notes: text('notes'),
});

export const workout_sets = sqliteTable('workout_sets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workout_log_id: integer('workout_log_id').references(() => workout_logs.id).notNull(),
  exercise_id: integer('exercise_id').references(() => exercises.id).notNull(),
  set_number: integer('set_number').notNull(),
  weight_kg: real('weight_kg'),
  reps: integer('reps'),
  rpe: real('rpe'),
  is_drop_set: integer('is_drop_set', { mode: 'boolean' }).default(false),
  is_myo_set: integer('is_myo_set', { mode: 'boolean' }).default(false),
});

export const body_tracking = sqliteTable('body_tracking', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  body_weight_kg: real('body_weight_kg'),
  chest_cm: real('chest_cm'),
  arm_cm: real('arm_cm'),
  thigh_cm: real('thigh_cm'),
  waist_cm: real('waist_cm'),
  notes: text('notes'),
});
