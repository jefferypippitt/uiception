export type PreviewIntent =
  | "task"
  | "monitor"
  | "realtime"
  | "throughput"
  | "sync"

export type MiniTableColumn = { header: string }
export type MiniTableRow = { cells: ReadonlyArray<string> }

export type MiniChartZone = {
  type: "line" | "area" | "bars" | "dots" | "sparkline"
  heights?: ReadonlyArray<number>
  points?: ReadonlyArray<number>
  barWidth?: "thin" | "normal"
}

export type MiniAppScreenZone =
  | {
      type: "live-stream"
      panelTitle: string
      stats: ReadonlyArray<{ value: string; label: string }>
      bars: ReadonlyArray<number>
    }
  | {
      type: "signal-flow"
      panelTitle: string
      nodes: ReadonlyArray<{ label: string; volume: number }>
      dotGrid: ReadonlyArray<ReadonlyArray<boolean>>
    }
  | {
      type: "health-split"
      panelTitle: string
      metrics: ReadonlyArray<{ value: string; label: string }>
      chartLabel: string
      areaPoints: ReadonlyArray<number>
    }
  | {
      type: "data-table"
      variant: "table-compact" | "table-mono"
      panelTitle: string
      queueSummary: string
      columns: ReadonlyArray<MiniTableColumn>
      rows: ReadonlyArray<MiniTableRow>
    }
  | {
      type: "dashboard"
      variant: "dashboard-kpi" | "dashboard-split"
      panelTitle: string
      metrics: ReadonlyArray<{ value: string; label: string }>
      bars?: ReadonlyArray<number>
      dotGrid?: ReadonlyArray<ReadonlyArray<boolean>>
    }
  | {
      type: "chart-dashboard"
      variant: "chart-line" | "chart-area" | "chart-dots"
      panelTitle: string
      metrics: ReadonlyArray<{ value: string; label: string }>
      chart: MiniChartZone
      dotGrid?: ReadonlyArray<ReadonlyArray<boolean>>
    }

export type FeaturePreviewSpec = {
  intent: PreviewIntent
  zones: ReadonlyArray<MiniAppScreenZone>
}

export type BuildFeaturePreviewInput = {
  id: string
  title: string
  description: string
  size: "large" | "mini"
}

const INTENT_KEYWORDS: Record<PreviewIntent, ReadonlyArray<string>> = {
  task: [
    "task",
    "queue",
    "backlog",
    "scheduled",
    "track",
    "timestamp",
    "automation",
    "row",
    "owner",
  ],
  monitor: [
    "monitor",
    "health",
    "uptime",
    "pipeline",
    "depth",
    "bottleneck",
    "glance",
    "overview",
    "review",
  ],
  realtime: [
    "real-time",
    "realtime",
    "live",
    "instant",
    "latency",
    "execution",
    "performance",
    "streaming",
    "respond",
  ],
  throughput: [
    "volume",
    "throughput",
    "runs",
    "activity",
    "signals",
    "ingest",
    "coordinate",
    "route",
  ],
  sync: ["sync", "import", "export", "transform", "deliver"],
}

const INTENT_ROTATION: ReadonlyArray<PreviewIntent> = [
  "monitor",
  "throughput",
  "task",
  "realtime",
  "sync",
]

export function hashString(input: string): number {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0
  }
  return hash
}

function seededValue(seed: string, min: number, max: number): number {
  const span = max - min + 1
  return min + (hashString(seed) % span)
}

function seededFloats(seed: string, count: number): ReadonlyArray<number> {
  const values: number[] = []
  for (let index = 0; index < count; index += 1) {
    values.push(28 + (hashString(`${seed}-${index}`) % 72))
  }
  return values
}

function classifyIntent(id: string, title: string, description: string): PreviewIntent {
  const haystack = `${title} ${description}`.toLowerCase()
  let bestIntent: PreviewIntent = INTENT_ROTATION[hashString(id) % INTENT_ROTATION.length]
  let bestScore = 0

  for (const intent of INTENT_ROTATION) {
    const score = INTENT_KEYWORDS[intent].reduce(
      (total, keyword) => total + (haystack.includes(keyword) ? 1 : 0),
      0
    )
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent
    }
  }

  return bestIntent
}

function splitClauses(description: string): string[] {
  return description
    .split(/[,;.]+/)
    .map((clause) => clause.trim())
    .filter(Boolean)
}

function titleWords(title: string): string[] {
  return title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2)
}

function panelTitleFromCopy(title: string, description: string): string {
  const clauses = splitClauses(description)
  if (clauses[0] && clauses[0].length <= 36) {
    return clauses[0].charAt(0).toUpperCase() + clauses[0].slice(1)
  }
  const words = title.split(/\s+/).slice(0, 3)
  return words.join(" ")
}

function metricLabelFromClause(clause: string, fallback: string): string {
  const trimmed = clause.trim()
  if (trimmed.length <= 22) return trimmed
  const words = trimmed.split(/\s+/).slice(-3)
  return words.join(" ")
}

function buildDotGrid(
  id: string,
  rows = 10,
  cols = 16
): ReadonlyArray<ReadonlyArray<boolean>> {
  return Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: cols },
      (_, col) => hashString(`${id}-dot-${row}-${col}`) % 3 !== 0
    )
  )
}

function buildTableZone(
  id: string,
  title: string,
  description: string,
  variant: "table-compact" | "table-mono"
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const panelTitle = panelTitleFromCopy(title, description)

  const columns: MiniTableColumn[] =
    variant === "table-mono"
      ? [{ header: "Handled" }, { header: "Assignee" }, { header: "Updated" }]
      : [{ header: "Item" }, { header: "Stage" }, { header: "Window" }]

  const rowSources = [
    clauses[0] ?? "Primary flow",
    clauses[1] ?? "Secondary path",
    clauses[2] ?? "Fallback lane",
    "Shared handoff",
  ]

  const rows: MiniTableRow[] = rowSources.slice(0, 4).map((clause, index) => {
    const words = clause.split(/\s+/).filter(Boolean)
    const cellA = words.slice(0, 2).join(" ") || `Lane ${index + 1}`
    const cellB = words.slice(2, 4).join(" ") || `Phase ${index + 1}`
    const cellC =
      variant === "table-mono"
        ? `${seededValue(`${id}-t-${index}`, 8, 23)}:${seededValue(`${id}-m-${index}`, 10, 59).toString().padStart(2, "0")}`
        : `${seededValue(`${id}-w-${index}`, 2, 9)}h window`

    return { cells: [cellA, cellB, cellC] }
  })

  return {
    type: "data-table",
    variant,
    panelTitle,
    queueSummary: `${rowSources.length} queued · next ${seededValue(`${id}-next-h`, 8, 23)}:${seededValue(`${id}-next-m`, 10, 59).toString().padStart(2, "0")}`,
    columns,
    rows,
  }
}

function buildDashboardZone(
  id: string,
  title: string,
  description: string,
  variant: "dashboard-kpi" | "dashboard-split"
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const panelTitle = panelTitleFromCopy(title, description)
  const words = titleWords(title)

  const metrics = [
    {
      value: `${seededValue(`${id}-m0`, 89, 99)}.${seededValue(`${id}-m0d`, 1, 9)}%`,
      label: metricLabelFromClause(clauses[0] ?? "Uptime trend", "Uptime trend"),
    },
    {
      value: `${seededValue(`${id}-m1`, 12, 148)}`,
      label: metricLabelFromClause(clauses[1] ?? words[0] ?? "Depth", "Queue depth"),
    },
  ]

  const bars = seededFloats(`${id}-bars`, 8)
  const dotGrid = buildDotGrid(id)

  return {
    type: "dashboard",
    variant,
    panelTitle,
    metrics,
    bars: variant === "dashboard-kpi" ? bars : undefined,
    dotGrid: variant === "dashboard-split" ? dotGrid : undefined,
  }
}

function buildChartZone(
  id: string,
  title: string,
  description: string,
  variant: "chart-line" | "chart-area" | "chart-dots"
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const panelTitle = panelTitleFromCopy(title, description)

  const chartTypes: ReadonlyArray<MiniChartZone["type"]> =
    variant === "chart-dots"
      ? ["dots"]
      : variant === "chart-area"
        ? ["area"]
        : ["line", "sparkline"]

  const chartType = chartTypes[hashString(`${id}-chart`) % chartTypes.length]
  const points = seededFloats(`${id}-pts`, 8)

  const metrics = [
    {
      value: `${seededValue(`${id}-r0`, 120, 890)}`,
      label: metricLabelFromClause(clauses[0] ?? "Active now", "Active now"),
    },
    {
      value: `${seededValue(`${id}-r1`, 1, 8)}.${seededValue(`${id}-r1d`, 1, 9)}s`,
      label: metricLabelFromClause(clauses[1] ?? "Avg delay", "Avg delay"),
    },
  ]

  return {
    type: "chart-dashboard",
    variant,
    panelTitle,
    metrics,
    chart: {
      type: chartType,
      points,
      heights: points,
    },
    dotGrid: chartType === "dots" ? buildDotGrid(`${id}-chart`) : undefined,
  }
}

type MiniVariant =
  | "table-compact"
  | "table-mono"
  | "dashboard-kpi"
  | "dashboard-split"
  | "chart-line"
  | "chart-area"
  | "chart-dots"

function pickMiniVariant(id: string, intent: PreviewIntent): MiniVariant {
  const variantsByIntent: Record<PreviewIntent, ReadonlyArray<MiniVariant>> = {
    task: ["table-compact", "table-mono"],
    monitor: ["dashboard-kpi", "dashboard-split"],
    realtime: ["chart-line", "chart-area", "chart-dots"],
    throughput: ["dashboard-split", "chart-dots", "chart-area"],
    sync: ["table-mono", "table-compact"],
  }

  const options = variantsByIntent[intent]
  return options[hashString(id) % options.length]
}

function shortLabel(clause: string, wordCount = 2): string {
  const words = clause.trim().split(/\s+/).filter(Boolean)
  if (words.length <= wordCount) return clause.trim()
  return words.slice(0, wordCount).join(" ")
}

function orchestrationNodeLabel(clause: string, index: number): string {
  const fallbacks = ["Across services", "Downstream handlers", "Throughput canvas"] as const
  const words = clause.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return fallbacks[index]

  if (index === 0) return words.slice(1, 2).join(" ") || fallbacks[0]
  if (index === 1) return words.slice(0, 2).join(" ") || fallbacks[1]
  return words.slice(2, 4).join(" ") || fallbacks[2]
}

function executionStatLabel(clause: string, index: number): string {
  const fallbacks = ["Runs firing", "Stage delay"] as const
  const words = clause.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return fallbacks[index]

  if (index === 0) return words.slice(1, 3).join(" ") || fallbacks[0]
  return words.slice(1, 3).join(" ") || fallbacks[1]
}

/** Live run monitor — header stat strip + full-width latency histogram. */
function buildRealtimeExecutionZone(
  id: string,
  _title: string,
  description: string
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const panelTitle = shortLabel(clauses[0] ?? "Watch runs as they fire", 4)

  return {
    type: "live-stream",
    panelTitle,
    stats: [
      {
        value: `${seededValue(`${id}-r0`, 120, 890)}`,
        label: executionStatLabel(clauses[0] ?? "Live runs", 0),
      },
      {
        value: `${seededValue(`${id}-r1`, 1, 8)}.${seededValue(`${id}-r1d`, 1, 9)}s`,
        label: executionStatLabel(clauses[1] ?? "Stage latency", 1),
      },
    ],
    bars: seededFloats(`${id}-bars`, 28),
  }
}

/** Orchestration — service signal route chain + activity volume grid. */
function buildWorkflowOrchestrationZone(
  id: string,
  _title: string,
  description: string
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const panelTitle = shortLabel(clauses[0] ?? "Chain steps across services", 4)

  const nodeLabels = [
    orchestrationNodeLabel(clauses[0] ?? "", 0),
    orchestrationNodeLabel(clauses[1] ?? "", 1),
    orchestrationNodeLabel(clauses[2] ?? "", 2),
  ]

  return {
    type: "signal-flow",
    panelTitle,
    nodes: nodeLabels.map((label, index) => ({
      label,
      volume: seededValue(`${id}-node-${index}`, 12, 148),
    })),
    dotGrid: buildDotGrid(`${id}-volume`, 8, 14),
  }
}

/** Pipeline health — queue depth KPIs beside uptime trend chart. */
function buildPipelineHealthZone(
  id: string,
  _title: string,
  description: string
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const panelTitle = shortLabel(clauses[0] ?? "Inspect backlog size", 3)

  return {
    type: "health-split",
    panelTitle,
    metrics: [
      {
        value: `${seededValue(`${id}-m1`, 12, 148)}`,
        label: shortLabel(clauses[0] ?? "Queue depth", 2),
      },
      {
        value: `${seededValue(`${id}-m0`, 89, 99)}.${seededValue(`${id}-m0d`, 1, 9)}%`,
        label: shortLabel(clauses[1] ?? "Uptime trend", 2),
      },
    ],
    chartLabel: shortLabel(clauses[1] ?? "Uptime trend", 2),
    areaPoints: seededFloats(`${id}-uptime`, 10),
  }
}

/** Shared job queue — recurring jobs with owner and next run. */
function buildTaskAutomationZone(
  id: string,
  _title: string,
  description: string
): MiniAppScreenZone {
  const clauses = splitClauses(description)
  const jobNames = [
    "Daily sync",
    "Weekly digest",
    "Invoice export",
    "Backup cron",
    "Report batch",
    "Webhook retry",
  ]
  const owners = ["ops", "finance", "analytics", "infra", "platform", "data"]

  const rows: MiniTableRow[] = Array.from({ length: 4 }, (_, index) => {
    const job =
      jobNames[hashString(`${id}-job-${index}`) % jobNames.length] ?? `Job ${index + 1}`
    const owner = owners[hashString(`${id}-owner-${index}`) % owners.length] ?? "team"
    const nextRun = `${seededValue(`${id}-t-${index}`, 8, 23)}:${seededValue(`${id}-m-${index}`, 0, 59).toString().padStart(2, "0")}`

    return { cells: [job, owner, nextRun] }
  })

  const nextHour = seededValue(`${id}-next-h`, 8, 23)
  const nextMinute = seededValue(`${id}-next-m`, 0, 59).toString().padStart(2, "0")

  return {
    type: "data-table",
    variant: "table-mono",
    panelTitle: shortLabel(clauses[0] ?? "Set cron-style schedules", 3),
    queueSummary: `${rows.length} jobs · next run ${nextHour}:${nextMinute}`,
    columns: [{ header: "Job" }, { header: "Owner" }, { header: "Next run" }],
    rows,
  }
}

const FEATURED_ZONE_BUILDERS: Record<
  string,
  (id: string, title: string, description: string) => MiniAppScreenZone
> = {
  "real-time-execution": buildRealtimeExecutionZone,
  "workflow-orchestration": buildWorkflowOrchestrationZone,
  "pipeline-health": buildPipelineHealthZone,
  "task-automation": buildTaskAutomationZone,
}

function buildMiniZone(
  id: string,
  title: string,
  description: string,
  intent: PreviewIntent
): MiniAppScreenZone {
  const featured = FEATURED_ZONE_BUILDERS[id]
  if (featured) {
    return featured(id, title, description)
  }

  const variant = pickMiniVariant(id, intent)

  if (variant === "table-compact" || variant === "table-mono") {
    return buildTableZone(id, title, description, variant)
  }

  if (variant === "dashboard-kpi" || variant === "dashboard-split") {
    return buildDashboardZone(id, title, description, variant)
  }

  return buildChartZone(id, title, description, variant)
}

export function buildFeaturePreview(input: BuildFeaturePreviewInput): FeaturePreviewSpec {
  const intent = classifyIntent(input.id, input.title, input.description)

  return {
    intent,
    zones: [buildMiniZone(input.id, input.title, input.description, intent)],
  }
}
