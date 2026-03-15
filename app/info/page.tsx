import { Card, CardHeader } from "@/components/ui/Card";
export const dynamic = "force-dynamic";
export default function InfoPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="border-b-[3px] border-brutal pb-6">
        <h1 className="font-display text-6xl uppercase leading-none">Info & Ernährung</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card>
          <CardHeader>Ernährung</CardHeader>
          <div className="font-mono text-sm space-y-4">
            <p className="font-bold uppercase bg-[var(--fg)] text-[var(--bg)] p-2 inline-block">
              Kalorienziel: Erhaltungsbedarf + 300-500 kcal
            </p>
            <ul className="list-inside list-square space-y-2 uppercase">
              <li>Protein: 1.8 - 2.2 g / kg KG</li>
              <li>Kohlenhydrate: 4 - 6 g / kg KG</li>
              <li>Fett: 0.8 - 1.2 g / kg KG</li>
            </ul>
            <div className="border-t-[2px] border-brutal border-dashed pt-4 mt-4">
              <strong>Timing:</strong> 3-4 Mahlzeiten, 1-2h vor Training KH+Protein, innerhalb 2h nach Training.
              <br/><br/>
              <strong>Supplements:</strong> Kreatin 3-5g täglich, Whey optional, Vitamin D + Omega 3 bei Mangel.
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>Regeneration</CardHeader>
          <div className="font-mono text-sm space-y-4 uppercase">
            <ul className="list-inside list-square space-y-3">
              <li>7-9 Stunden Schlaf (Stichwort: GH im Tiefschlaf).</li>
              <li>48-72 Stunden Pause zwischen gleichen Muskelgruppen.</li>
              <li>Aktive Erholung: Spazieren, Dehnen, Foam Rolling.</li>
              <li>Stressmanagement: Cortisol hemmt Muskelaufbau.</li>
              <li className="text-accent underline">Deload-Woche nach jedem 4-Wochen Block (50% Volumen).</li>
            </ul>
          </div>
        </Card>

        <Card className="!border-accent">
          <CardHeader className="!bg-accent">Plateau & Sicherheit</CardHeader>
          <div className="font-mono text-sm space-y-6">
            <div>
              <h3 className="font-bold uppercase underline mb-2">Plateau Breaker:</h3>
              <ul className="list-inside list-square space-y-1 uppercase text-xs">
                <li>Griffweite / Grifftyp wechseln</li>
                <li>Exzentrische Phase auf 4-5 Sekunden</li>
                <li>Halbe Sätze ans Ende anhängen</li>
                <li>Reihenfolge variieren</li>
              </ul>
            </div>
            <div className="border-t-[2px] border-brutal border-dashed pt-4">
              <h3 className="font-bold uppercase underline mb-2">Sicherheit:</h3>
              <ul className="list-inside list-square space-y-1 uppercase text-xs">
                <li>Technik vor Gewicht!</li>
                <li>Ausatmen bei Anstrengung, Einatmen beim Absenken.</li>
                <li>Muskelschmerz (Brennen) = O.K., Gelenkschmerz = STOPP.</li>
                <li>Bei Krankheit / starker Müdigkeit: Pausieren.</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
