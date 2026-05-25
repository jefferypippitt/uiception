import StatusChip from "./status-chip"

import type { ProductPreviewConfig } from "./config"

type TasksConfig = ProductPreviewConfig["panels"]["tasks"]

export default function TasksPanel({ tasks }: { tasks: TasksConfig }) {
  return (
    <div className="relative z-1 flex min-h-0 flex-col">
      <h3 className="hero-v9-panel-heading shrink-0 px-4 py-2.5 text-sm font-medium text-foreground">
        {tasks.legendTitle}
      </h3>

      <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-3">
        {tasks.legend.map((item) => (
          <StatusChip key={item.label} label={item.label} state={item.state} />
        ))}
      </div>

      <h4 className="hero-v9-section-heading px-4 py-2 font-mono text-xs text-muted-foreground">
        {tasks.tableTitle}
      </h4>

      <div className="font-mono text-xs">
        <div className="hero-v9-table-head grid grid-cols-3 items-center justify-items-center px-4 py-2 text-center text-muted-foreground">
          <span>Automation</span>
          <span>Status</span>
          <span>Last run</span>
        </div>

        {tasks.rows.map((row) => (
          <div
            key={row.automation}
            className="hero-v9-table-row hero-v9-table-row-live grid grid-cols-3 items-center justify-items-center px-4 py-2.5 text-center"
          >
            <span className="text-sm text-foreground/80">{row.automation}</span>
            <StatusChip label={row.status} state={row.state} />
            <span className="text-xs text-muted-foreground tabular-nums">
              {row.lastRun}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
