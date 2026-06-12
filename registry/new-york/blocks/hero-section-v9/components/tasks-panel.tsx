import StatusChip from "./status-chip"

import type { ProductPreviewConfig } from "../lib/config"

type TasksConfig = ProductPreviewConfig["panels"]["tasks"]

export default function TasksPanel({ tasks }: { tasks: TasksConfig }) {
  return (
    <div className="relative z-1 flex min-h-0 flex-col">
      <h3 className="hero-v9-panel-heading px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-widest text-muted-foreground">
        {tasks.legendTitle}
      </h3>

      <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-3" />

      <div>
        <div className="hero-v9-table-head grid grid-cols-[1fr_100px_72px] items-center px-4 py-2 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
          <span>Automation</span>
          <span className="text-center">Status</span>
          <span className="text-right">Last run</span>
        </div>

        {tasks.rows.map((row) => (
          <div
            key={row.automation}
            className="hero-v9-table-row hero-v9-table-row-live grid grid-cols-[1fr_100px_72px] items-center px-4 py-2.5"
          >
            <span className="text-sm font-medium text-foreground">{row.automation}</span>
            <div className="flex justify-center">
              <StatusChip label={row.status} state={row.state} />
            </div>
            <span className="text-right text-xs text-muted-foreground tabular-nums">
              {row.lastRun}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
