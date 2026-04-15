import type { CSSProperties } from "react"

export function StatCell({
  value,
  label,
  valueStyle,
}: {
  value: string
  label: string
  valueStyle?: CSSProperties
}) {
  return (
    <div className="flex flex-col gap-1 px-6 py-8 text-center md:px-8 md:py-10">
      <p
        className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl"
        style={valueStyle}
      >
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
