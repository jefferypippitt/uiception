import { cn } from "@/lib/utils"

export default function MetricCard({
  value,
  label,
  pulseKey,
}: {
  value: string
  label: string
  pulseKey?: number
}) {
  return (
    <div className="hero-v9-metric flex flex-col items-center justify-center gap-1 px-3 py-4 text-center">
      <span
        key={`${value}-${pulseKey ?? 0}`}
        className={cn(
          "hero-v9-metric-value text-2xl font-medium tracking-tight text-foreground tabular-nums",
          pulseKey !== undefined && pulseKey > 0 && "hero-v9-metric-live"
        )}
      >
        {value}
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
