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

/** Fan-out activity — density increases left → right under the hop path. */
function buildFanOutDotGrid(
  id: string,
  rows = 8,
  cols = 14
): ReadonlyArray<ReadonlyArray<boolean>> {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const band = Math.floor((col / cols) * 3)
      const chance = band === 0 ? 2 : band === 1 ? 3 : 4
      return hashString(`${id}-fan-${row}-${col}`) % 5 < chance
    })
  )
}

/** Delivery curve with a mid-span choke dip. */
function seededDeliveryCurve(id: string, count = 10): number[] {
  return Array.from({ length: count }, (_, index) => {
    const base = seededValue(`${id}-del-${index}`, 58, 94)
    const choke = index === 4 || index === 5
    return choke ? Math.max(26, base - 38) : base
  })
}

/** Live run monitor — header stat strip + full-width latency histogram. */
function buildRealtimeExecutionZone(
  id: string,
  _title: string,
  _description: string
): MiniAppScreenZone {
  return {
    type: "live-stream",
    panelTitle: "Live runs",
    stats: [
      {
        value: `${seededValue(`${id}-r0`, 120, 890)}`,
        label: "Runs Firing",
      },
      {
        value: `${seededValue(`${id}-r1`, 1, 8)}.${seededValue(`${id}-r1d`, 1, 9)}s`,
        label: "Stage Delay",
      },
    ],
    bars: seededFloats(`${id}-bars`, 28),
  }
}

/** Orchestration — hop path across services + fan-out activity grid. */
function buildWorkflowOrchestrationZone(
  id: string,
  _title: string,
  _description: string
): MiniAppScreenZone {
  const nodes = [
    { label: "Trigger", volume: seededValue(`${id}-node-0`, 86, 148) },
    { label: "Fan Out", volume: seededValue(`${id}-node-1`, 42, 96) },
    { label: "Handlers", volume: seededValue(`${id}-node-2`, 18, 64) },
  ] as const

  return {
    type: "signal-flow",
    panelTitle: "Service chain",
    nodes,
    dotGrid: buildFanOutDotGrid(`${id}-volume`),
  }
}

/** Pipeline health — backlog + reliability beside delivery curve with choke. */
function buildPipelineHealthZone(
  id: string,
  _title: string,
  _description: string
): MiniAppScreenZone {
  return {
    type: "health-split",
    panelTitle: "Pipeline health",
    metrics: [
      {
        value: `${seededValue(`${id}-m1`, 24, 148)}`,
        label: "Backlog",
      },
      {
        value: `${seededValue(`${id}-m0`, 96, 99)}.${seededValue(`${id}-m0d`, 1, 9)}%`,
        label: "Reliability",
      },
    ],
    chartLabel: "Delivery",
    areaPoints: seededDeliveryCurve(`${id}-uptime`),
  }
}

/** Shared job queue — recurring jobs with owner and next run. */
function buildTaskAutomationZone(
  id: string,
  _title: string,
  _description: string
): MiniAppScreenZone {
  const jobNames = [
    "Daily Sync",
    "Weekly Digest",
    "Invoice Export",
    "Backup Cron",
    "Report Batch",
    "Webhook Retry",
  ]
  const owners = ["Ops", "Finance", "Analytics", "Infra", "Platform", "Data"]

  const rows: MiniTableRow[] = Array.from({ length: 4 }, (_, index) => {
    const job =
      jobNames[hashString(`${id}-job-${index}`) % jobNames.length] ?? `Job ${index + 1}`
    const owner = owners[hashString(`${id}-owner-${index}`) % owners.length] ?? "Team"
    const nextRun = `${seededValue(`${id}-t-${index}`, 8, 23)}:${seededValue(`${id}-m-${index}`, 0, 59).toString().padStart(2, "0")}`

    return { cells: [job, owner, nextRun] }
  })

  const nextHour = seededValue(`${id}-next-h`, 8, 23)
  const nextMinute = seededValue(`${id}-next-m`, 0, 59).toString().padStart(2, "0")

  return {
    type: "data-table",
    variant: "table-mono",
    panelTitle: "Scheduled jobs",
    queueSummary: `${rows.length} jobs · next run ${nextHour}:${nextMinute}`,
    columns: [{ header: "Job" }, { header: "Owner" }, { header: "Next Run" }],
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
