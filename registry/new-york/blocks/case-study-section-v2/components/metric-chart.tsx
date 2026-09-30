import type { MetricChart as MetricChartData } from "../lib/config"

/** Every chart draws into the same 160×56 box so they line up in the list. */
const W = 160
const H = 56
const PLOT = { left: 2, right: W - 6, top: 8, bottom: 42 }
const TICK_Y = H - 3

export function MetricChart({ chart }: { chart: MetricChartData }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="size-full overflow-visible text-[8px] tabular-nums"
    >
      {chart.type === "steps" && (
        <StepsChart values={chart.values} ticks={chart.ticks} />
      )}
      {chart.type === "burndown" && (
        <BurndownChart values={chart.values} ticks={chart.ticks} />
      )}
      {chart.type === "timeline" && (
        <TimelineChart rows={chart.rows} ticks={chart.ticks} />
      )}
    </svg>
  )
}

function scaleX(index: number, count: number) {
  return PLOT.left + (index / (count - 1)) * (PLOT.right - PLOT.left)
}

function scaleY(value: number, max: number) {
  return PLOT.bottom - (value / max) * (PLOT.bottom - PLOT.top)
}

function Gridlines() {
  return (
    <g className="stroke-border" strokeWidth={1}>
      {[PLOT.top, (PLOT.top + PLOT.bottom) / 2].map((y) => (
        <line
          key={y}
          x1={PLOT.left}
          x2={PLOT.right}
          y1={y}
          y2={y}
          strokeDasharray="2 3"
        />
      ))}
      <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} />
    </g>
  )
}

function Ticks({ labels }: { labels: string[] }) {
  return (
    <g className="fill-muted-foreground">
      {labels.map((label, index) => (
        <text
          key={label}
          x={scaleX(index, labels.length)}
          y={TICK_Y}
          textAnchor={
            index === 0
              ? "start"
              : index === labels.length - 1
                ? "end"
                : "middle"
          }
        >
          {label}
        </text>
      ))}
    </g>
  )
}

function EndPoint({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={5} className="fill-foreground/10" />
      <circle
        cx={x}
        cy={y}
        r={2.5}
        className="fill-foreground stroke-background"
        strokeWidth={1.5}
      />
    </>
  )
}

function StepsChart({ values, ticks }: { values: number[]; ticks: string[] }) {
  const max = Math.max(...values)
  const points = values.map((value, index) => ({
    x: scaleX(index, values.length),
    y: scaleY(value, max),
  }))
  const line = points
    .map((point, index) =>
      index === 0 ? `M${point.x},${point.y}` : `H${point.x}V${point.y}`
    )
    .join("")
  const last = points[points.length - 1]

  return (
    <>
      <Gridlines />
      <path d={`${line}V${PLOT.bottom}H${PLOT.left}Z`} className="fill-muted" />
      <path
        d={line}
        fill="none"
        className="stroke-foreground"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {points.slice(0, -1).map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={1.25}
          className="fill-muted-foreground"
        />
      ))}
      <EndPoint x={last.x} y={last.y} />
      <Ticks labels={ticks} />
    </>
  )
}

function BurndownChart({
  values,
  ticks,
}: {
  values: number[]
  ticks: string[]
}) {
  const max = values[0]
  const points = values.map((value, index) => ({
    x: scaleX(index, values.length),
    y: scaleY(value, max),
  }))
  const line = points.map((point) => `${point.x},${point.y}`).join(" ")
  const last = points[points.length - 1]

  return (
    <>
      <Gridlines />
      <polygon
        points={`${PLOT.left},${PLOT.bottom} ${line} ${last.x},${PLOT.bottom}`}
        className="fill-muted"
      />
      <line
        x1={PLOT.left}
        y1={PLOT.top}
        x2={PLOT.right}
        y2={PLOT.bottom}
        className="stroke-muted-foreground"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <polyline
        points={line}
        fill="none"
        className="stroke-foreground"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <EndPoint x={last.x} y={last.y} />
      <text
        x={PLOT.right}
        y={PLOT.top - 2}
        textAnchor="end"
        className="fill-muted-foreground"
      >
        Plan
      </text>
      <Ticks labels={ticks} />
    </>
  )
}

const TIMELINE = { labelWidth: 30, rowHeight: 9, rowGap: 7, segmentGap: 1.5 }

function TimelineChart({
  rows,
  ticks,
}: {
  rows: { label: string; stages: number[] }[]
  ticks: number[]
}) {
  const maxDays = Math.max(
    ...rows.map((row) => row.stages.reduce((sum, days) => sum + days, 0)),
    ...ticks
  )
  const x0 = TIMELINE.labelWidth
  const dayWidth = (PLOT.right - x0) / maxDays
  const rowsHeight =
    rows.length * TIMELINE.rowHeight + (rows.length - 1) * TIMELINE.rowGap
  const top = PLOT.top + (PLOT.bottom - PLOT.top - rowsHeight) / 2

  return (
    <>
      <g className="stroke-border" strokeWidth={1}>
        {ticks.map((day) => (
          <line
            key={day}
            x1={x0 + day * dayWidth}
            x2={x0 + day * dayWidth}
            y1={PLOT.top - 4}
            y2={PLOT.bottom}
            strokeDasharray={day === 0 ? undefined : "2 3"}
          />
        ))}
      </g>

      {rows.map((row, rowIndex) => {
        const y = top + rowIndex * (TIMELINE.rowHeight + TIMELINE.rowGap)
        const isCurrent = rowIndex === rows.length - 1
        const total = row.stages.reduce((sum, days) => sum + days, 0)
        const starts = row.stages.map((_, stageIndex) =>
          row.stages.slice(0, stageIndex).reduce((sum, days) => sum + days, 0)
        )

        return (
          <g key={row.label}>
            <text
              x={0}
              y={y + TIMELINE.rowHeight - 1.5}
              className={
                isCurrent ? "fill-foreground" : "fill-muted-foreground"
              }
            >
              {row.label}
            </text>
            {row.stages.map((days, stageIndex) => (
              <rect
                key={stageIndex}
                x={x0 + starts[stageIndex] * dayWidth}
                y={y}
                width={days * dayWidth - TIMELINE.segmentGap}
                height={TIMELINE.rowHeight}
                rx={1.5}
                className={
                  isCurrent
                    ? "fill-foreground"
                    : stageIndex % 2 === 0
                      ? "fill-muted-foreground/40"
                      : "fill-muted-foreground/25"
                }
              />
            ))}
            {isCurrent && (
              <text
                x={x0 + total * dayWidth + 3}
                y={y + TIMELINE.rowHeight - 1.5}
                className="fill-foreground"
              >
                {total}d
              </text>
            )}
          </g>
        )
      })}

      <g className="fill-muted-foreground">
        {ticks.map((day) => (
          <text
            key={day}
            x={x0 + day * dayWidth}
            y={TICK_Y}
            textAnchor={day === 0 ? "start" : "middle"}
          >
            {day === 0 ? "0" : `${day}d`}
          </text>
        ))}
      </g>
    </>
  )
}
