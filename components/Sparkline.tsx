import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  color?: string;
  className?: string;
}

export function Sparkline({ data, color = "var(--accent)", className }: SparklineProps) {
  if (data.length < 2) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center font-mono text-sm uppercase text-gray-500", className)}>
        Zu wenig Daten
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (((d - min) / range) * 100);
    return { x, y };
  });

  return (
    <div className={cn("relative w-full h-full", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          points={points.map(p => `${p.x},${p.y}`).join(" ")}
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--bg)" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  );
}
