import { getPhasesWithDays } from "@/lib/queries";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";
export default async function PlanPage() {
  const phases = await getPhasesWithDays();

  return (
    <div className="flex flex-col gap-12">
      <div className="border-b-[3px] border-brutal pb-6">
        <h1 className="font-display text-6xl uppercase leading-none">Trainingsplan</h1>
        <p className="font-mono mt-4 uppercase">Maximaler Muskelaufbau // 3-Monats-Blaupause</p>
      </div>

      <div className="flex flex-col gap-16">
        {phases.map(p => (
          <section key={p.id} className="border-[3px] border-brutal p-6 md:p-8 bg-[var(--bg)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b-[3px] border-brutal pb-6">
              <div>
                <Badge variant="accent" className="mb-2">Phase {p.phase_number}</Badge>
                <h2 className="font-display text-5xl uppercase leading-none">{p.name}</h2>
              </div>
              <div className="font-mono text-right text-sm uppercase">
                <div>Woche {p.weeks}</div>
                <div>Tempo {p.tempo || "Auto"}</div>
                <div>Reps {p.rep_range}</div>
              </div>
            </div>

            <div className="font-mono text-sm mb-8 bg-[var(--fg)] text-[var(--bg)] p-4 uppercase">
              Fokus: {p.focus}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {p.days.map(d => (
                <Card key={d.id} className="!border-[2px]">
                  <CardHeader className="flex flex-row justify-between items-center !text-xl !border-b-[2px]">
                    <span>Tag {d.day_label}: {d.day_name}</span>
                  </CardHeader>
                  <div className="font-mono text-xs mb-4 pb-4 border-b-[2px] border-brutal border-dashed uppercase text-gray-500">
                    {d.target_muscles}
                  </div>
                  
                  <ul className="flex flex-col gap-4 font-mono text-sm">
                    {d.exercises.map((pe, idx) => (
                      <li key={pe.id} className="grid grid-cols-12 gap-2">
                        <div className="col-span-1 pr-2 text-gray-500 font-bold">{idx+1}.</div>
                        <div className="col-span-7 font-bold uppercase">{pe.exercise?.name}</div>
                        <div className="col-span-4 text-right">
                          {pe.sets}x{pe.reps}
                          {pe.intensity_tech && (
                            <div className="text-accent text-xs mt-1">[{pe.intensity_tech.replace('_', ' ')}]</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Glossary */}
      <Card className="mt-8 !border-accent border-[3px]">
        <CardHeader className="!bg-accent">Glossar: Intensitätstechniken</CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
          <div>
            <h4 className="font-bold underline uppercase mb-2">Drop-Satz</h4>
            <p>Nach letztem Satz Gewicht um 30% reduzieren, sofort weiter bis Versagen.</p>
          </div>
          <div>
            <h4 className="font-bold underline uppercase mb-2">Supersatz (SS)</h4>
            <p>Zwei Übungen direkt hintereinander ohne Pause.</p>
          </div>
          <div>
            <h4 className="font-bold underline uppercase mb-2">Pause-Reps</h4>
            <p>Am Versagen 10s pausieren, dann 2-3 weitere Wiederholungen erzwingen.</p>
          </div>
          <div>
            <h4 className="font-bold underline uppercase mb-2">Myo-Reps</h4>
            <p>1 Aktivierungssatz (12-15 Wdh), dann 3-5 Minisätze à 3-5 Wdh mit 5s Pause.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
