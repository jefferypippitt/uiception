import { cn } from "@/lib/utils"

import type { ProductPreviewConfig } from "../lib/config"

type ActivityConfig = ProductPreviewConfig["panels"]["activity"]

export default function ActivityPanel({
  activity,
  live = false,
}: {
  activity: ActivityConfig
  live?: boolean
}) {
  const maxIndex = activity.bars.reduce(
    (best, height, index) => (height > activity.bars[best] ? index : best),
    0
  )

  return (
    <div className="hero-v9-activity-panel relative z-1 flex min-h-0 flex-1 flex-col">
      <h3 className="hero-v9-panel-heading shrink-0 px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-widest text-muted-foreground">
        {activity.title}
      </h3>

      <div
        className={cn(
          "hero-v9-activity-chart flex min-h-0 w-full flex-1 items-end justify-between gap-1 px-4 py-3",
          live && "hero-v9-activity-chart-live"
        )}
        aria-hidden
      >
        {activity.bars.map((height, index) => (
          <div
            key={index}
            className={cn(
              "hero-v9-bar w-2 shrink-0 rounded-t-sm",
              live && "hero-v9-bar-live",
              index === maxIndex
                ? "bg-(--pp-accent)"
                : "bg-(--pp-accent-muted)"
            )}
            style={{
              height: `${height}%`,
              animationDelay: live ? `${Math.min(index * 5, 150)}ms` : undefined,
              transitionDelay: live ? `${index * 4}ms` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}
