import type { LifelineLegendItem } from "./types"

const LEGEND_DOT_CLASS: Record<LifelineLegendItem["type"], string> = {
  met: "bg-pink-500",
  work: "bg-amber-500",
  college: "bg-violet-500",
  destination: "bg-teal-500",
}

const DEFAULT_ITEMS: LifelineLegendItem[] = [
  { type: "met", label: "Global events" },
  { type: "destination", label: "Destinations" },
  { type: "work", label: "Work" },
  { type: "college", label: "College" },
]

export function LifelineLegend({
  items = DEFAULT_ITEMS,
}: {
  items?: LifelineLegendItem[]
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
      {items.map((item) => (
        <li key={item.type} className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${LEGEND_DOT_CLASS[item.type]}`}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
