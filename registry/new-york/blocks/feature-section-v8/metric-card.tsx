export default function MetricCard({
  value,
  label,
  valueClassName,
}: {
  value: string
  label: string
  valueClassName?: string
}) {
  return (
    <div className="fsv8-metric flex flex-col gap-0.5 px-2.5 py-2">
      <span
        className={
          valueClassName
            ? `${valueClassName} text-base font-medium tracking-tight text-foreground tabular-nums`
            : "text-base font-medium tracking-tight text-foreground tabular-nums"
        }
      >
        {value}
      </span>
      <span className="font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
