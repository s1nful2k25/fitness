import { getWorkoutHistory } from "@/lib/queries";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
export const dynamic = "force-dynamic";
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function LogbookPage() {
  const history = await getWorkoutHistory();

  return (
    <div className="flex flex-col gap-12">
      <div className="border-b-[3px] border-brutal pb-6 flex justify-between items-end">
        <h1 className="font-display text-6xl uppercase leading-none">Logbuch</h1>
        <Badge variant="outline" className="text-xl px-4 py-2">{history.length} Workouts</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {history.length === 0 ? (
          <p className="font-mono text-gray-500 col-span-2">Noch keine Workouts aufgezeichnet.</p>
        ) : (
          history.map(log => (
            <Card key={log.id} className="flex flex-col justify-between hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-none group">
              <div>
                <CardHeader className="group-hover:bg-[var(--bg)] group-hover:text-[var(--fg)] group-hover:border-[var(--bg)]">
                  {log.day?.day_label} - {log.day?.day_name}
                </CardHeader>
                <div className="font-mono flex flex-col gap-2 mb-6">
                  <div className="flex justify-between border-b-[2px] border-brutal border-dashed pb-2">
                    <span className="uppercase opacity-70">Datum</span>
                    <span>{formatDate(log.date)}</span>
                  </div>
                  <div className="flex justify-between border-b-[2px] border-brutal border-dashed pb-2">
                    <span className="uppercase opacity-70">Dauer</span>
                    <span>{log.duration_min} Min</span>
                  </div>
                  {log.notes && (
                    <div className="mt-2 text-sm italic">{log.notes}</div>
                  )}
                </div>
              </div>
              
              <Link href={`/log/${log.id}`}>
                <Button variant="outline" className="w-full group-hover:border-[var(--bg)] group-hover:text-[var(--bg)]">Details Ansehen →</Button>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
