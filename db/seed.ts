import { db } from './index';
import { exercises, phases, training_days, plan_exercises } from './schema';

const DB_DATA = {
  phases: [
    { phase_number: 1, name: 'Hypertrophie-Basis', weeks: '1-4', focus: 'Basis, Technik, Volumen', tempo: '2-1-2', rep_range: '8-12' },
    { phase_number: 2, name: 'Progressive Überlastung', weeks: '5-8', focus: 'Gewichte steigern, Stärke', tempo: '3-1-1', rep_range: '6-10' },
    { phase_number: 3, name: 'Intensitätstechniken', weeks: '9-12', focus: 'Plateau durchbrechen, Drop, Supersätze, Myo-Reps', tempo: null, rep_range: '6-12' },
  ],
  days: [
    { label: 'A', name: 'Push', target_muscles: 'Brust, Schultern, Trizeps' },
    { label: 'B', name: 'Pull', target_muscles: 'Rücken, Bizeps, hintere Schulter' },
    { label: 'C', name: 'Beine & Core', target_muscles: 'Quadrizeps, Beinbeuger, Gesäß, Bauch' },
  ]
};

const EXERCISES_RAW = [
  // Phase 1 - Tag A
  { p: 1, d: 'A', n: 'Liegestütze (Gewichtsweste)', mg: 'chest', eq: 'weight_vest', s: '3', r: '10-12', rest: 60, note: 'Weste für Zusatzgewicht nutzen' },
  { p: 1, d: 'A', n: 'Kurzhantel-Schulterpresse', mg: 'shoulders', eq: 'dumbbells', s: '4', r: '10-12', rest: 60, note: 'Stehend, volle ROM, Schulter-Fokus' },
  { p: 1, d: 'A', n: 'Seitheben mit Hanteln', mg: 'shoulders', eq: 'dumbbells', s: '4', r: '12-15', rest: 45, note: 'Langsam heben, 2s oben halten' },
  { p: 1, d: 'A', n: 'Frontheben mit Hanteln', mg: 'shoulders', eq: 'dumbbells', s: '3', r: '10-12', rest: 45, note: 'Abwechselnd, vordere Schulter' },
  { p: 1, d: 'A', n: 'Dips am Stuhl', mg: 'triceps', eq: 'bodyweight', s: '3', r: '10-12', rest: 45, note: 'Gewichtsweste für Progression' },
  { p: 1, d: 'A', n: 'Überkopf-Trizepsstr. (Hantel)', mg: 'triceps', eq: 'dumbbells', s: '3', r: '10-12', rest: 45, note: 'Beide Hände, voller Stretch' },
  { p: 1, d: 'A', n: 'Band-Trizepsdrücken', mg: 'triceps', eq: 'band', s: '2', r: '12-15', rest: 45, note: 'Band an Klimmzugstange befestigen' },
  // Phase 1 - Tag B
  { p: 1, d: 'B', n: 'Klimmzüge (Untergriff)', mg: 'back', eq: 'pullup_bar', s: '3', r: '6-10', rest: 90, note: 'Untergriff = mehr Bizeps-Aktivierung' },
  { p: 1, d: 'B', n: 'Kurzhantel-Rudern vorgebeugt', mg: 'back', eq: 'dumbbells', s: '3', r: '10-12', rest: 60, note: 'Beide Arme einzeln, Schulterblatt zusammen' },
  { p: 1, d: 'B', n: 'Klimmzüge (Obergriff, weit)', mg: 'back', eq: 'pullup_bar', s: '3', r: '6-10', rest: 90, note: 'Breiter Griff für Lat-Fokus' },
  { p: 1, d: 'B', n: 'Face Pulls mit Band', mg: 'rear_delt', eq: 'band', s: '3', r: '12-15', rest: 45, note: 'Hintere Schulter, Band an Stange' },
  { p: 1, d: 'B', n: 'Kurzhantel-Bizepscurls', mg: 'biceps', eq: 'dumbbells', s: '3', r: '10-12', rest: 45, note: 'Abwechselnd, kein Schwung' },
  { p: 1, d: 'B', n: 'Hammer Curls', mg: 'biceps', eq: 'dumbbells', s: '3', r: '10-12', rest: 45, note: 'Neutraler Griff, Brachialis-Fokus' },
  { p: 1, d: 'B', n: 'Reverse Flys (Hanteln)', mg: 'rear_delt', eq: 'dumbbells', s: '3', r: '12-15', rest: 45, note: 'Vorgebeugt, hintere Schulter isolieren' },
  // Phase 1 - Tag C
  { p: 1, d: 'C', n: 'Goblet Squats (Kurzhantel)', mg: 'quads', eq: 'dumbbells', s: '4', r: '10-12', rest: 60, note: 'Hantel vor der Brust halten' },
  { p: 1, d: 'C', n: 'Bulgarische Split Squats', mg: 'quads', eq: 'dumbbells', s: '3', r: '10-12/Seite', rest: 60, note: 'Hinterer Fuß auf Stuhl, Hanteln halten' },
  { p: 1, d: 'C', n: 'Rumänisches Kreuzheben', mg: 'hamstrings', eq: 'dumbbells', s: '3', r: '10-12', rest: 60, note: 'Hanteln, langsame Negativphase' },
  { p: 1, d: 'C', n: 'Ausfallschritte (Gewichtsweste)', mg: 'quads', eq: 'weight_vest', s: '3', r: '10-12/Seite', rest: 60, note: 'Abwechselnd, aufrecht bleiben' },
  { p: 1, d: 'C', n: 'Wadenheben einbeinig', mg: 'calves', eq: 'bodyweight', s: '3', r: '15-20/Seite', rest: 30, note: 'Auf einer Stufe, volle ROM' },
  { p: 1, d: 'C', n: 'Plank mit Gewichtsweste', mg: 'core', eq: 'weight_vest', s: '3', r: '30-45s', rest: 30, note: 'Körperspannung halten' },
  // Phase 2 - Tag A
  { p: 2, d: 'A', n: 'Liegestütze (Gewichtsweste + erhöht)', mg: 'chest', eq: 'weight_vest', s: '3', r: '8-10', rest: 75, note: 'Füße erhöht für mehr Brustaktivierung' },
  { p: 2, d: 'A', n: 'Kurzhantel-Schulterpresse', mg: 'shoulders', eq: 'dumbbells', s: '4', r: '8-10', rest: 75, note: 'Schwerer als Phase 1, Schulter-Prio' },
  { p: 2, d: 'A', n: 'Arnold Press', mg: 'shoulders', eq: 'dumbbells', s: '3', r: '8-10', rest: 60, note: 'Rotation für alle 3 Schulterköpfe' },
  { p: 2, d: 'A', n: 'Seitheben + Frontheben SS', mg: 'shoulders', eq: 'dumbbells', s: '3', r: '12 + 10', rest: 60, note: 'Supersatz: seitlich direkt zu frontal', tech: 'superset' },
  { p: 2, d: 'A', n: 'Diamant-Liegestütze (Weste)', mg: 'triceps', eq: 'weight_vest', s: '3', r: '8-12', rest: 60, note: 'Trizeps-Fokus, enge Hände' },
  { p: 2, d: 'A', n: 'Überkopf-Trizepsstr. (Hantel)', mg: 'triceps', eq: 'dumbbells', s: '3', r: '10-12', rest: 45, note: 'Beide Arme, voller Stretch' },
  { p: 2, d: 'A', n: 'Trizeps-Kickbacks (Band)', mg: 'triceps', eq: 'band', s: '2', r: '12-15', rest: 45, note: 'Band für konstante Spannung' },
  // Phase 2 - Tag B
  { p: 2, d: 'B', n: 'Klimmzüge (Gewichtsweste)', mg: 'back', eq: 'pullup_bar', s: '4', r: '6-8', rest: 90, note: 'Untergriff, Bizeps + Rücken' },
  { p: 2, d: 'B', n: 'Kurzhantel-Rudern einarmig', mg: 'back', eq: 'dumbbells', s: '3', r: '8-10/Seite', rest: 60, note: 'Schwere Hantel, saubere Form' },
  { p: 2, d: 'B', n: 'Klimmzüge eng (Untergriff)', mg: 'back', eq: 'pullup_bar', s: '3', r: '6-8', rest: 90, note: 'Gewichtsweste, maximaler Bizeps-Reiz' },
  { p: 2, d: 'B', n: 'Face Pulls + Band-Pull-Apart SS', mg: 'rear_delt', eq: 'band', s: '3', r: '12 + 15', rest: 45, note: 'Supersatz: hintere Schulter doppelt', tech: 'superset' },
  { p: 2, d: 'B', n: 'Konzentrations-Curls', mg: 'biceps', eq: 'dumbbells', s: '3', r: '8-10/Seite', rest: 45, note: 'Isolation, langsame Negativphase' },
  { p: 2, d: 'B', n: 'Schräg-Curls (Hanteln)', mg: 'biceps', eq: 'dumbbells', s: '3', r: '10-12', rest: 45, note: 'Oberarm leicht zurück, langer Bizeps' },
  { p: 2, d: 'B', n: 'Reverse Flys (Hanteln)', mg: 'rear_delt', eq: 'dumbbells', s: '3', r: '12-15', rest: 45, note: 'Vorgebeugt, hintere Schulter' },
  // Phase 2 - Tag C
  { p: 2, d: 'C', n: 'Goblet Squats (schwer)', mg: 'quads', eq: 'dumbbells', s: '4', r: '8-10', rest: 75, note: 'Maximales Hantelgewicht nutzen' },
  { p: 2, d: 'C', n: 'Bulg. Split Squats + Hanteln', mg: 'quads', eq: 'dumbbells', s: '4', r: '8-10/Seite', rest: 75, note: 'Beide Hanteln, erhöhtes Gewicht' },
  { p: 2, d: 'C', n: 'Einbeiniges Rum. Kreuzheben', mg: 'hamstrings', eq: 'dumbbells', s: '3', r: '8-10/Seite', rest: 60, note: 'Balance und Kraft kombinieren' },
  { p: 2, d: 'C', n: 'Pistol Squat Progression', mg: 'quads', eq: 'bodyweight', s: '3', r: '6-8/Seite', rest: 75, note: 'An Stange festhalten falls nötig' },
  { p: 2, d: 'C', n: 'Wadenheben (Gewichtsweste)', mg: 'calves', eq: 'weight_vest', s: '4', r: '12-15', rest: 45, note: 'Beidbeinig auf Stufe' },
  { p: 2, d: 'C', n: 'Hängendes Beinheben', mg: 'core', eq: 'pullup_bar', s: '3', r: '10-12', rest: 45, note: 'An Klimmzugstange, Beine gestreckt' },
  // Phase 3 - Tag A
  { p: 3, d: 'A', n: 'Liegestütze (Weste) + Drop', mg: 'chest', eq: 'weight_vest', s: '3', r: '6-8 + Drop', rest: 75, note: 'Letzter Satz: Weste ablegen, weiter', tech: 'drop_set' },
  { p: 3, d: 'A', n: 'Schulterpresse (Drop-Satz)', mg: 'shoulders', eq: 'dumbbells', s: '4', r: '8-10 + Drop', rest: 75, note: 'Gewicht um 5 kg senken beim Drop', tech: 'drop_set' },
  { p: 3, d: 'A', n: 'Seitheben + Frontheben SS', mg: 'shoulders', eq: 'dumbbells', s: '3', r: '12 + 10', rest: 60, note: 'Supersatz: alle Schulterköpfe', tech: 'superset' },
  { p: 3, d: 'A', n: 'Arnold Press (Pause-Reps)', mg: 'shoulders', eq: 'dumbbells', s: '3', r: '8 + 2-3', rest: 60, note: 'Am Versagen 10s, dann weiter', tech: 'pause_reps' },
  { p: 3, d: 'A', n: 'Diamant-Liegest. (Pause-Reps)', mg: 'triceps', eq: 'bodyweight', s: '3', r: 'max + 2-3', rest: 60, note: 'Trizeps am Limit, Weste optional', tech: 'pause_reps' },
  { p: 3, d: 'A', n: 'Überkopf-Trizepsstr. (Myo)', mg: 'triceps', eq: 'dumbbells', s: '1+4', r: '15 + 4x5', rest: 5, note: 'Maximaler Trizeps-Stretch', tech: 'myo_reps' },
  { p: 3, d: 'A', n: 'Band-Seitheben (Myo-Reps)', mg: 'shoulders', eq: 'band', s: '1+3', r: '15 + 3x5', rest: 5, note: 'Schulter-Finisher', tech: 'myo_reps' },
  // Phase 3 - Tag B
  { p: 3, d: 'B', n: 'Klimmzüge (Weste) + Drop', mg: 'back', eq: 'weight_vest', s: '4', r: '5-7 + Drop', rest: 90, note: 'Letzter Satz: Weste ab, weiter', tech: 'drop_set' },
  { p: 3, d: 'B', n: 'Rudern + Hammer Curls SS', mg: 'back', eq: 'dumbbells', s: '3', r: '8-10 + 10', rest: 75, note: 'Rudern direkt zu Hammer Curls', tech: 'superset' },
  { p: 3, d: 'B', n: 'Klimmzüge eng (Pause-Reps)', mg: 'biceps', eq: 'pullup_bar', s: '3', r: 'max + 2-3', rest: 90, note: 'Untergriff, Bizeps bis zum Versagen', tech: 'pause_reps' },
  { p: 3, d: 'B', n: 'Face Pulls (Myo-Reps)', mg: 'rear_delt', eq: 'band', s: '1+4', r: '15 + 4x5', rest: 5, note: 'Band, Schultergesundheit + Volumen', tech: 'myo_reps' },
  { p: 3, d: 'B', n: 'Bizepscurls (Drop-Satz)', mg: 'biceps', eq: 'dumbbells', s: '3', r: '8-10 + Drop', rest: 60, note: 'Gewicht um 5 kg reduzieren', tech: 'drop_set' },
  { p: 3, d: 'B', n: 'Schräg-Curls (Myo-Reps)', mg: 'biceps', eq: 'dumbbells', s: '1+3', r: '12 + 3x5', rest: 5, note: 'Langer Kopf Bizeps, maximale Dehnung', tech: 'myo_reps' },
  { p: 3, d: 'B', n: 'Reverse Flys (Drop-Satz)', mg: 'rear_delt', eq: 'dumbbells', s: '3', r: '12 + Drop', rest: 45, note: 'Hintere Schulter, leichtere Hanteln', tech: 'drop_set' },
  // Phase 3 - Tag C
  { p: 3, d: 'C', n: 'Goblet Squats (Drop-Satz)', mg: 'quads', eq: 'dumbbells', s: '4', r: '6-8 + Drop', rest: 75, note: 'Gewicht halbieren beim Drop', tech: 'drop_set' },
  { p: 3, d: 'C', n: 'Split Squats + Jump Lunges SS', mg: 'quads', eq: 'dumbbells', s: '3', r: '8 + 8/Seite', rest: 75, note: 'Kraft + Plyometrie', tech: 'superset' },
  { p: 3, d: 'C', n: 'Einb. Kreuzheben (Pause-Reps)', mg: 'hamstrings', eq: 'dumbbells', s: '3', r: '8 + 2-3', rest: 60, note: 'Pause-Reps im letzten Satz', tech: 'pause_reps' },
  { p: 3, d: 'C', n: 'Wandsitz (Gewichtsweste)', mg: 'quads', eq: 'weight_vest', s: '3', r: '30-45s', rest: 45, note: 'Isometrisch, Hantel auf Oberschenkel' },
  { p: 3, d: 'C', n: 'Wadenheben (Myo-Reps)', mg: 'calves', eq: 'bodyweight', s: '1+4', r: '20 + 4x5', rest: 5, note: 'Volle ROM, Squeeze oben', tech: 'myo_reps' },
  { p: 3, d: 'C', n: 'Hängendes Beinheben + Plank SS', mg: 'core', eq: 'pullup_bar', s: '3', r: '10 + 30s', rest: 45, note: 'Core-Supersatz', tech: 'superset' },
];

async function seed() {
  console.log('Seeding Database...');
  
  // Idempotent: Delete plan structures
  await db.delete(plan_exercises).execute();
  await db.delete(training_days).execute();
  await db.delete(phases).execute();
  await db.delete(exercises).execute();

  // 1. Insert Phases
  console.log('Inserting Phases...');
  const phaseMap: Record<number, number> = {};
  for (const ph of DB_DATA.phases) {
    const [inserted] = await db.insert(phases).values(ph).returning({ id: phases.id });
    phaseMap[ph.phase_number] = inserted.id;
  }

  // 2. Insert Training Days
  console.log('Inserting Training Days...');
  const dayMap: Record<string, number> = {}; // key: "1-A"
  for (const ph of DB_DATA.phases) {
    for (const d of DB_DATA.days) {
      const dbPhaseId = phaseMap[ph.phase_number];
      const [inserted] = await db.insert(training_days).values({
        phase_id: dbPhaseId,
        day_label: d.label,
        day_name: d.name,
        target_muscles: d.target_muscles,
      }).returning({ id: training_days.id });
      dayMap[`${ph.phase_number}-${d.label}`] = inserted.id;
    }
  }

  // 3. Insert Exercises & Plan Mapping
  console.log('Inserting Exercises and Plan...');
  let sortMap: Record<number, number> = {};
  
  for (const exRaw of EXERCISES_RAW) {
    // Check if exercise already exists by name? The prompt separates by phase, but an exercise could be reused. 
    // We'll create distinct entries or reuse? "Alle 63 Übungseinträge... abbilden". To be exact with notes/equipment varying per phase, let's treat each row as a distinct exercise entry or map closely.
    // The prompt says "Alle 63 Übungseinträge", so creating 63 `exercises` entries is simplest and ensures correct notes/equipment for that specific phase block!
    const [ex] = await db.insert(exercises).values({
      name: exRaw.n,
      muscle_group: exRaw.mg,
      equipment: exRaw.eq,
      notes: exRaw.note,
    }).returning({ id: exercises.id });

    const trainDayId = dayMap[`${exRaw.p}-${exRaw.d}`];
    if (!sortMap[trainDayId]) sortMap[trainDayId] = 0;
    sortMap[trainDayId]++;

    await db.insert(plan_exercises).values({
      training_day_id: trainDayId,
      exercise_id: ex.id,
      sets: exRaw.s,
      reps: exRaw.r,
      rest_seconds: exRaw.rest,
      intensity_tech: exRaw.tech || null,
      notes: exRaw.note,
      sort_order: sortMap[trainDayId],
    });
  }

  console.log(`✅ Seeded successfully (${EXERCISES_RAW.length} exercises mapped).`);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
