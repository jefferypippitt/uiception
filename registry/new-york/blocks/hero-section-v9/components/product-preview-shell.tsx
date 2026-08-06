"use client"

import ActivityPanel from "./activity-panel"
import MetricsRow from "./metrics-row"
import TasksPanel from "./tasks-panel"
import { useLiveDashboardPreview } from "../hooks/use-live-dashboard-preview"

import type { ProductPreviewConfig } from "../lib/config"

export default function ProductPreviewShell({
  preview,
}: {
  preview: ProductPreviewConfig
}) {
  const live = useLiveDashboardPreview(preview)

  return (
    <div
      className="pp-root relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl bg-(--pp-shell-bg) shadow-(--pp-shadow)"
      role="img"
      aria-label="Operations dashboard preview"
    >
      <MetricsRow metrics={live.metrics} />
      <div className="hero-v9-panels grid grid-cols-1 items-stretch lg:grid-cols-2">
        <ActivityPanel
          activity={live.panels.activity}
          live
          pulseKey={live.barsPulseKey}
          taskStates={live.panels.tasks.rows.map((row) => row.state)}
          queuedJobs={live.queuedJobs}
          barPeaks={live.barPeaks}
        />
        <TasksPanel tasks={live.panels.tasks} />
      </div>
    </div>
  )
}
