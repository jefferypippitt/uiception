import MetricCard from "./metric-card"

export default function MetricsRow({
  metrics,
  pulseKey,
}: {
  metrics: ReadonlyArray<{ value: string; label: string }>
  pulseKey?: number
}) {
  return (
    <div className="hero-v9-metrics relative z-1">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          value={metric.value}
          label={metric.label}
          pulseKey={pulseKey}
        />
      ))}
    </div>
  )
}
