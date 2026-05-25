import { cn } from "@/lib/utils"

import type { ProductPreviewConfig } from "./config"

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
      <h3 className="hero-v9-panel-heading flex shrink-0 items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-foreground">
        <span>{activity.title}</span>
        {live ? (
          <span
            className="hero-v9-live-signal"
            aria-hidden
            title="Simulated live data"
          >
            <span className="hero-v9-live-signal-bar" />
            <span className="hero-v9-live-signal-bar" />
            <span className="hero-v9-live-signal-bar" />
          </span>
        ) : null}
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
              animationDelay: live ? `${Math.min(index * 14, 560)}ms` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}
