import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

import type { PreviewStatusState, ProductPreviewConfig } from "../lib/config"

type ActivityConfig = ProductPreviewConfig["panels"]["activity"]

// Integer-only hash (no Math.sin) so the result is bit-identical on the
// server and client — transcendental functions like Math.sin can differ in
// their last bit between engines, which caused hydration mismatches once
// that noise was amplified into CSS custom properties.
function pseudoRandom(seed: number, salt: number): number {
  let x = (seed * 374761393 + salt * 668265263) | 0
  x = (x ^ (x >>> 13)) * 1274126177
  x = (x ^ (x >>> 16)) >>> 0
  return x / 4294967296
}

const QUEUED_BAR_MIN = 3
const QUEUED_BAR_MAX = 14
const QUEUED_JOBS_BASELINE = 20
const QUEUED_JOBS_PER_BAR = 2

// Queued/status bars don't measure anything — their meaning lives in fill
// style (dashed/hollow) and how many of them there are, not in height. They
// share one flat height so they read as a state ledger, not more volume data.
const STATE_ZONE_BAR_HEIGHT = 60

// Scales the real "Queued jobs" count into a bar count, so the backlog the
// chart implies is sitting behind the 4 named automations grows and shrinks
// with the actual metric instead of always looking like exactly 4 jobs.
function queuedBarCountFor(queuedJobs: number): number {
  const scaled = Math.round((queuedJobs - QUEUED_JOBS_BASELINE) / QUEUED_JOBS_PER_BAR)
  return Math.min(QUEUED_BAR_MAX, Math.max(QUEUED_BAR_MIN, scaled))
}

export default function ActivityPanel({
  activity,
  live = false,
  pulseKey,
  taskStates = [],
  queuedJobs = 0,
  barPeaks = [],
}: {
  activity: ActivityConfig
  live?: boolean
  pulseKey?: number
  taskStates?: ReadonlyArray<PreviewStatusState>
  queuedJobs?: number
  barPeaks?: ReadonlyArray<boolean>
}) {
  const lastIndex = activity.bars.length - 1

  // The rightmost bars double as a status readout: one bar per automation
  // in the Status overview table, filled while it's running and hollow
  // once it completes — so "bars filled" tracks "tasks running" 1:1.
  const hasStatusBars = taskStates.length > 0
  const statusBarStart = activity.bars.length - taskStates.length

  // Just before those, a wider band of dashed bars stands in for the rest
  // of the queue that isn't named in the table — its width tracks the real
  // "Queued jobs" metric so the volume chart implies a bigger backlog.
  const queuedBarCount = hasStatusBars ? queuedBarCountFor(queuedJobs) : 0
  const queuedZoneStart = Math.max(0, statusBarStart - queuedBarCount)

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
        {activity.bars.map((height, index) => {
          const waveDuration = 1.8 + pseudoRandom(index, 1) * 1.8
          const waveDelay = -(pseudoRandom(index, 2) * waveDuration)
          const isNewest = live && index === lastIndex

          const taskState =
            index >= statusBarStart
              ? taskStates[index - statusBarStart]
              : undefined
          const isCompletedBar = taskState !== undefined && taskState !== "running"
          const isQueuedBar =
            taskState === undefined &&
            index >= queuedZoneStart &&
            index < statusBarStart
          const isStateZoneBar = index >= queuedZoneStart

          return (
            <div
              key={index}
              className={cn(
                "hero-v9-bar w-2 shrink-0 rounded-t-sm",
                live && "hero-v9-bar-live"
              )}
              style={{
                height: `${isStateZoneBar ? STATE_ZONE_BAR_HEIGHT : height}%`,
                animationDelay: live ? `${Math.min(index * 5, 150)}ms` : undefined,
                transitionDelay: live ? `${index * 3}ms` : undefined,
              }}
            >
              <span
                key={isNewest ? pulseKey : undefined}
                className={cn(
                  "block h-full w-full rounded-t-sm",
                  isCompletedBar
                    ? "hero-v9-bar-fill-hollow"
                    : isQueuedBar
                      ? "hero-v9-bar-fill-queued"
                      : cn(
                          "hero-v9-bar-fill",
                          // Accent marks bars that landed as a volume burst,
                          // which is the same event that bumps "Runs
                          // completed" — so the highlight tracks that metric
                          // instead of just whichever bar is tallest.
                          barPeaks[index]
                            ? "bg-(--pp-accent)"
                            : "bg-(--pp-accent-muted)"
                        ),
                  isNewest && !isCompletedBar && !isQueuedBar && "hero-v9-bar-fill-new"
                )}
                style={
                  isQueuedBar
                    ? { animationDelay: `${(index - queuedZoneStart) * 90}ms` }
                    : live && !isCompletedBar
                      ? ({
                          "--wave-duration": `${waveDuration}s`,
                          "--wave-delay": `${waveDelay}s`,
                        } as CSSProperties)
                      : undefined
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
