import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/db";
import { getNextWorkoutDay, getWorkoutHistory, getBodyTrackingHistory, getActivePhase } from "@/lib/queries";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
// A simple utility to format dates
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function DashboardPage() {
  const activePhase = await getActivePhase();
  const nextWorkout = await getNextWorkoutDay();
  const history = await getWorkoutHistory();
  const bodyHistory = await getBodyTrackingHistory();

  const lastWorkout = history[0];

  // Calculate Streak (workouts this week)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // approximate monday
  startOfWeek.setHours(0,0,0,0);
  
  const workoutsThisWeek = history.filter(h => new Date(h.date) >= startOfWeek).length;
  // Render streak circles (max 3)
  const streakCircles = Array.from({length: 3}).map((_, i) => i < workoutsThisWeek ? "●" : "○").join("");

  // Bodyweight Sparkline
  // We need the last 12 entries or last 12 weeks
  const bwData = bodyHistory.filter(b => b.body_weight_kg).slice(0, 12).reverse();
  const maxBw = Math.max(...bwData.map(b => b.body_weight_kg || 0), 1);
  const minBw = Math.min(...bwData.map(b => b.body_weight_kg || 0), 0);
  const range = (maxBw - minBw) || 1;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end border-b-[3px] border-brutal pb-6">
        <h1 className="font-display text-6xl uppercase leading-none">Status</h1>
        <Badge variant="accent" className="text-xl px-4 py-2">Phase {activePhase?.phase_number || 1}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* WORKOUT QUICK ACTION */}
        <Card className="flex flex-col gap-6 !bg-accent !text-white !border-[var(--fg)]">
          <div>
            <h2 className="font-display text-4xl uppercase mb-2">Bereit?</h2>
            <p className="font-mono opacity-90">Nächstes Workout: {nextWorkout?.day_label} - {nextWorkout?.day_name}</p>
          </div>
          <Link href="/workout" className="mt-auto">
            <Button className="w-full border-white text-[var(--fg)] bg-white hover:bg-[var(--fg)] hover:text-white" size="lg">Workout Starten →</Button>
          </Link>
        </Card>

        {/* WEEKLY STREAK */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-2xl uppercase border-b-[3px] border-brutal pb-2 mb-4">Wochen-Streak</h3>
            <div className="font-mono text-5xl tracking-widest text-accent text-center py-4">
              {streakCircles}
            </div>
          </div>
          <p className="font-mono text-sm uppercase text-center mt-4 border-t-[3px] border-brutal pt-4">
            {workoutsThisWeek} / 3 Einheiten absolviert
          </p>
        </Card>

        {/* LAST WORKOUT */}
        <Card>
          <CardHeader>Letztes Training</CardHeader>
          {lastWorkout ? (
            <div className="flex flex-col gap-4 font-mono">
              <div className="flex justify-between border-b-[2px] border-brutal pb-2">
                <span className="uppercase text-gray-500">Datum</span>
                <span>{formatDate(lastWorkout.date)}</span>
              </div>
              <div className="flex justify-between border-b-[2px] border-brutal pb-2">
                <span className="uppercase text-gray-500">Tag</span>
                <span>{lastWorkout.day?.day_label} - {lastWorkout.day?.day_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase text-gray-500">Dauer</span>
                <span>{lastWorkout.duration_min} MIN</span>
              </div>
            </div>
          ) : (
            <p className="font-mono text-gray-500">Noch kein Training absolviert.</p>
          )}
        </Card>

        {/* BODYWEIGHT SPARKLINE */}
        <Card>
          <CardHeader>Körpergewicht (12w)</CardHeader>
          <div className="h-32 w-full mt-4 relative border-[2px] border-brutal bg-[var(--fg)] p-2">
            {bwData.length > 1 ? (
              <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <polyline
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  points={bwData.map((d, i) => {
                    const x = (i / (bwData.length - 1)) * 100;
                    const y = 100 - (((d.body_weight_kg! - minBw) / range) * 100);
                    return `${x},${y}`;
                  }).join(" ")}
                />
                {bwData.map((d, i) => {
                    const x = (i / (bwData.length - 1)) * 100;
                    const y = 100 - (((d.body_weight_kg! - minBw) / range) * 100);
                    return <circle key={i} cx={x} cy={y} r="3" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
                })}
              </svg>
            ) : (
               <div className="w-full h-full flex items-center justify-center font-mono text-accent text-sm">Zu wenig Daten</div>
            )}
          </div>
          {bwData.length > 0 && (
            <div className="flex justify-between mt-2 font-mono text-sm">
              <span>{bwData[0]?.body_weight_kg}kg</span>
              <span>{bwData[bwData.length-1]?.body_weight_kg}kg</span>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
