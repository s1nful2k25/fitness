"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Timer } from '../ui/Timer';
import { Badge } from '../ui/Badge';
import { logWorkoutAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface TrackerProps {
  dayId: number;
  exercises: any[];
}

export function WorkoutTracker({ dayId, exercises }: TrackerProps) {
  const router = useRouter();
  const [warmupDone, setWarmupDone] = useState(false);
  const [sets, setSets] = useState<any[]>([]);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);

  // Local state to hold temporary inputs per exercise
  const [inputs, setInputs] = useState<Record<number, { w: string, r: string, rpe: string }>>({});

  const handleInput = (exId: number, field: string, val: string) => {
    setInputs(prev => ({
      ...prev,
      [exId]: { ...(prev[exId] || { w: '', r: '', rpe: '' }), [field]: val }
    }));
  };

  const addSet = (exId: number, restSeconds: number, isDrop = false, isMyo = false) => {
    const current = inputs[exId] || {};
    const weight = parseFloat(current.w);
    const reps = parseInt(current.r, 10);
    const rpe = parseFloat(current.rpe);

    const newSet = {
      exercise_id: exId,
      weight_kg: isNaN(weight) ? undefined : weight,
      reps: isNaN(reps) ? undefined : reps,
      rpe: isNaN(rpe) ? undefined : rpe,
      is_drop_set: isDrop,
      is_myo_set: isMyo,
      _id: Math.random().toString() // for react key
    };

    setSets(prev => [...prev, newSet]);
    setActiveTimer(restSeconds); // Start timer automatically
    
    // reset reps but keep weight for convenience
    setInputs(prev => ({
      ...prev,
      [exId]: { ...prev[exId], r: '', rpe: '' }
    }));
  };

  const removeSet = (setId: string) => {
    setSets(prev => prev.filter(s => s._id !== setId));
  };

  const finishWorkout = async () => {
    setSaving(true);
    const duration = Math.round((Date.now() - startTime) / 60000);
    
    try {
      const dbSets = sets.map(({ _id, ...rest }) => rest);
      await logWorkoutAction({
        training_day_id: dayId,
        duration_min: duration,
        sets: dbSets
      });
      router.push('/log');
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 font-mono">
      {/* GLOBAL REST TIMER HEADER STICKY */}
      {activeTimer !== null && (
        <div className="sticky top-0 z-40 bg-[var(--bg)] py-3 border-b-[3px] border-brutal w-full -mx-4 px-4 shadow-[0_10px_0_0_var(--bg)] flex justify-between items-center -mt-4 mb-4">
            <span className="font-display text-xl uppercase hidden md:inline-block">Pause:</span>
            <Timer initialSeconds={activeTimer} autoStart={true} onComplete={() => setActiveTimer(null)} className="w-[80vw] mx-auto md:w-auto md:mx-0 p-2 border-[2px]" />
            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => setActiveTimer(null)}>×</Button>
            <button className="md:hidden font-mono font-bold text-xl px-2" onClick={() => setActiveTimer(null)}>×</button>
        </div>
      )}

      {/* WARMUP */}
      <Card className={warmupDone ? "opacity-50" : ""}>
        <CardHeader className="flex justify-between items-center">
          Warmup (5 Min)
          <Button variant="outline" size="sm" onClick={() => setWarmupDone(!warmupDone)}>
            {warmupDone ? "X" : "✓"}
          </Button>
        </CardHeader>
        {!warmupDone && (
          <ul className="list-inside list-square space-y-2 uppercase text-sm mt-4">
            <li>Jumping Jacks: 60s (Kreislauf)</li>
            <li>Armkreisen: 30s / Richtung</li>
            <li>Kniekreisen: 30s</li>
            <li>Katzenbuckel / Kuh: 30s</li>
            <li>1 Aufwärmsatz: 15 Wdh (50% Gew.)</li>
          </ul>
        )}
      </Card>

      {/* EXERCISES */}
      {exercises.map((p, index) => {
        const exSets = sets.filter(s => s.exercise_id === p.exercise.id);
        const currInput = inputs[p.exercise.id] || { w: p.suggestion?.w?.toString() || '', r: '', rpe: '' };

        return (
          <Card key={p.id} className="relative">
            <div className="absolute top-0 right-0 bg-transparent text-[var(--fg)] px-3 py-1 font-display text-4xl leading-none">
              {index + 1}
            </div>
            
            <CardHeader className="pr-12">
              <span className="flex flex-col md:flex-row md:items-center gap-2">
                {p.exercise.name}
              </span>
            </CardHeader>

            <div className="text-sm uppercase bg-accent/10 border-l-[3px] border-accent p-2 mb-6">
              <strong>Ziel:</strong> {p.sets}x{p.reps} | Pause: {p.rest_seconds}s
              {p.intensity_tech && <span> | Tech: {p.intensity_tech.replace('_', ' ')}</span>}
              <br/>
              <span className="italic text-gray-600">Hinweis: {p.notes}</span>
            </div>

            {/* LOGGED SETS */}
            {exSets.length > 0 && (
              <div className="mb-6 border-[2px] border-brutal bg-gray-50">
                <table className="w-full text-left font-mono text-sm border-collapse">
                  <thead>
                    <tr className="border-b-[2px] border-brutal border-dashed">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">kg</th>
                      <th className="py-2 px-3">Reps</th>
                      <th className="py-2 px-3 text-right">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exSets.map((s, idx) => (
                      <tr key={s._id} className="border-b-[1px] border-brutal/20 last:border-0 hover:bg-gray-200">
                        <td className="py-2 px-3 font-bold">{idx + 1}
                           {s.is_drop_set && <Badge variant="accent" className="ml-2 scale-75 origin-left">DROP</Badge>}
                           {s.is_myo_set && <Badge variant="accent" className="ml-2 scale-75 origin-left">MYO</Badge>}
                        </td>
                        <td className="py-2 px-3">{s.weight_kg || '-'}</td>
                        <td className="py-2 px-3">{s.reps || '-'}</td>
                        <td className="py-2 px-3 text-right">
                          <button onClick={() => removeSet(s._id)} className="text-accent underline hover:opacity-70 uppercase tracking-widest text-xs">Entfernen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* INPUT FORM */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                <Input 
                   type="number" step="0.5" placeholder="Gewicht"  pattern="[0-9]*" inputMode="decimal"
                   value={currInput.w} onChange={(e) => handleInput(p.exercise.id, 'w', e.target.value)} 
                />
                <Input 
                   type="number" placeholder="Wdh" pattern="[0-9]*" inputMode="numeric"
                   value={currInput.r} onChange={(e) => handleInput(p.exercise.id, 'r', e.target.value)} 
                />
                <Input 
                   type="number" step="0.5" placeholder="RPE" pattern="[0-9]*" inputMode="decimal"
                   value={currInput.rpe} onChange={(e) => handleInput(p.exercise.id, 'rpe', e.target.value)} 
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button variant="primary" onClick={() => addSet(p.exercise.id, p.rest_seconds)} className="flex-1">
                  + SATZ ({p.rest_seconds}s PAUSE)
                </Button>
                {p.intensity_tech === 'drop_set' && (
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white" onClick={() => addSet(p.exercise.id, p.rest_seconds, true, false)}>
                    + DROP
                  </Button>
                )}
                {p.intensity_tech === 'myo_reps' && (
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white" onClick={() => addSet(p.exercise.id, 5, false, true)}>
                    + MYO
                  </Button>
                )}
              </div>
            </div>

          </Card>
        );
      })}

      <Button size="lg" className="w-full text-3xl py-8 mt-12 bg-[var(--fg)] text-[var(--bg)] hover:bg-accent" onClick={finishWorkout} disabled={saving || sets.length === 0}>
        {saving ? "SPEICHERT..." : "WORKOUT ABSCHLIESSEN"}
      </Button>

    </div>
  );
}
