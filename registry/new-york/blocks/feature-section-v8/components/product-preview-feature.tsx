"use client"

import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { elementDelay, elementDuration } from "../lib/animation-timing"
import MetricCard from "./metric-card"
import { useLiveFeaturePreview } from "../hooks/use-live-feature-preview"

import type { FeaturePreviewSpec, MiniAppScreenZone } from "../lib/build-feature-preview"

function MockScreen({ children }: { children: ReactNode }) {
  return (
    <div className="fsv8-mock-screen fsv8-mock-body flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  )
}

function chartValues(chart: { heights?: ReadonlyArray<number>; points?: ReadonlyArray<number> }) {
  return chart.heights ?? chart.points ?? []
}

function MiniAreaChart({ points }: { points: ReadonlyArray<number> }) {
  if (points.length < 2) return null

  const width = 100
  const height = 100
  const step = width / (points.length - 1)
  const linePath = points
    .map((point, index) => {
      const x = index * step
      const y = height - (point / 100) * height
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg
      className="fsv8-area-chart block h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={areaPath} fill="var(--pp-accent-muted)" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--pp-accent)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function MiniLineChart({ points }: { points: ReadonlyArray<number> }) {
  if (points.length < 2) return null

  const width = 100
  const height = 100
  const step = width / (points.length - 1)
  const path = points
    .map((point, index) => {
      const x = index * step
      const y = height - (point / 100) * height
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")

  return (
    <svg
      className="fsv8-line-chart block h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke="var(--pp-accent)"
        strokeWidth="1.75"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function MiniBarChart({
  heights,
  thin = false,
  live = false,
  scan,
  seed = "bars",
}: {
  heights: ReadonlyArray<number>
  thin?: boolean
  live?: boolean
  scan?: boolean
  seed?: string
}) {
  const maxIndex = heights.reduce(
    (best, height, index) => (height > heights[best] ? index : best),
    0
  )
  const showScan = scan ?? live

  return (
    <div
      className={cn(
        thin
          ? "fsv8-bar-chart fsv8-bar-chart--thin flex min-h-0 flex-1 items-end justify-between px-2.5 py-2"
          : "fsv8-bar-chart flex min-h-0 flex-1 items-end gap-1 px-2.5 py-2",
        showScan && "fsv8-bar-chart-live"
      )}
      style={
        showScan
          ? ({
              "--fsv8-scan-delay": `${elementDelay(`${seed}-scan`, 0, 4800)}ms`,
            } as CSSProperties)
          : undefined
      }
      aria-hidden
    >
      {heights.map((height, index) => (
        <div
          key={index}
          className={cn(
            thin
              ? "fsv8-bar fsv8-bar--thin shrink-0"
              : "fsv8-bar w-1.5 shrink-0",
            live && "fsv8-bar-live",
            index === maxIndex ? "bg-(--pp-accent)" : "bg-(--pp-accent-muted)"
          )}
          style={
            live
              ? ({
                  height: `${height}%`,
                  "--fsv8-bar-delay": `${elementDelay(`${seed}-bar-${index}`, 0, 720)}ms`,
                  "--fsv8-bar-duration": `${elementDuration(`${seed}-bar-d-${index}`, 380, 1100)}ms`,
                  "--fsv8-bar-rise-delay": `${elementDelay(`${seed}-bar-rise-${index}`, 0, 640)}ms`,
                  "--fsv8-bar-rise-duration": `${elementDuration(`${seed}-bar-rise-d-${index}`, 420, 980)}ms`,
                } as CSSProperties)
              : { height: `${height}%` }
          }
        />
      ))}
    </div>
  )
}

function DotGridPanel({
  dotGrid,
  compact = false,
  live = false,
  seed = "dots",
}: {
  dotGrid: ReadonlyArray<ReadonlyArray<boolean>>
  compact?: boolean
  live?: boolean
  seed?: string
}) {
  const rows = dotGrid.length
  const cols = dotGrid[0]?.length ?? 1

  return (
    <div
      className={cn(
        compact ? "fsv8-dot-grid fsv8-dot-grid--compact" : "fsv8-dot-grid",
        live && "fsv8-dot-grid-live"
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      aria-hidden
    >
      {dotGrid.flatMap((row, rowIndex) =>
        row.map((active, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="fsv8-dot-grid-cell">
            <span
              className={cn(
                "fsv8-dot-grid-dot",
                active && "fsv8-dot-grid-dot--active",
                live && active && "fsv8-dot-grid-dot--live"
              )}
              style={
                live && active
                  ? ({
                      "--fsv8-dot-delay": `${elementDelay(`${seed}-dot-${rowIndex}-${colIndex}`, 0, 2200)}ms`,
                      "--fsv8-dot-duration": `${elementDuration(`${seed}-dot-d-${rowIndex}-${colIndex}`, 1200, 2800)}ms`,
                    } as CSSProperties)
                  : undefined
              }
            />
          </div>
        ))
      )}
    </div>
  )
}

function LiveStreamZone({
  zone,
  live,
  instanceId,
}: {
  zone: Extract<MiniAppScreenZone, { type: "live-stream" }>
  live: boolean
  pulseKey: number
  instanceId: string
}) {
  return (
    <MockScreen>
      <div className="fsv8-stat-strip flex shrink-0 border-b border-(--pp-border)">
        {zone.stats.map((stat) => (
          <div
            key={stat.label}
            className="fsv8-stat-strip-item flex flex-1 flex-col gap-0.5 px-2.5 py-2"
          >
            <span className="text-base font-medium tracking-tight text-foreground tabular-nums">
              {stat.value}
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
      <MiniBarChart heights={zone.bars} thin live={live} scan={false} seed={`${instanceId}-stream`} />
    </MockScreen>
  )
}

function SignalFlowZone({
  zone,
  live,
  activeNodeIndex,
  instanceId,
}: {
  zone: Extract<MiniAppScreenZone, { type: "signal-flow" }>
  live: boolean
  pulseKey: number
  activeNodeIndex: number
  instanceId: string
}) {
  return (
    <MockScreen>
      <div
        className={cn(
          "fsv8-signal-route shrink-0 border-b border-(--pp-border) px-3 py-3",
          live && "fsv8-signal-route-live"
        )}
      >
        <div className="flex items-end">
          {zone.nodes.map((node, index) => {
            const isActive = live && index === activeNodeIndex
            const isPast = live && index < activeNodeIndex

            return (
              <div key={node.label} className="flex min-w-0 flex-1 items-end">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex min-w-0 items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "truncate font-mono text-[0.625rem] leading-none",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {node.label}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[0.5625rem] tabular-nums leading-none",
                        isActive ? "text-foreground/70" : "text-muted-foreground/55"
                      )}
                    >
                      {node.volume}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "fsv8-signal-hop h-1 w-full",
                      isActive && "fsv8-signal-hop--active",
                      isPast && "fsv8-signal-hop--past"
                    )}
                  />
                </div>
                {index < zone.nodes.length - 1 ? (
                  <span
                    className={cn(
                      "fsv8-signal-gap mb-0.5 h-px w-2 shrink-0",
                      isPast || isActive
                        ? "bg-(--pp-accent-muted)"
                        : "bg-(--pp-border)"
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
      <DotGridPanel dotGrid={zone.dotGrid} compact live={live} seed={`${instanceId}-signal`} />
    </MockScreen>
  )
}

function HealthSplitZone({
  zone,
  live,
}: {
  zone: Extract<MiniAppScreenZone, { type: "health-split" }>
  live: boolean
  pulseKey: number
}) {
  const chokeIndex = zone.areaPoints.reduce(
    (lowest, point, index) =>
      point < zone.areaPoints[lowest]! ? index : lowest,
    0
  )
  const chokeLeft =
    zone.areaPoints.length > 1
      ? `${(chokeIndex / (zone.areaPoints.length - 1)) * 100}%`
      : "50%"

  return (
    <MockScreen>
      <div className="flex min-h-0 flex-1">
        <div className="fsv8-health-sidebar flex w-[36%] shrink-0 flex-col border-r border-(--pp-border)">
          {zone.metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
              valueClassName={live ? "fsv8-stat-live" : undefined}
            />
          ))}
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-2.5 py-2">
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-muted-foreground">
              {zone.chartLabel}
            </span>
            <span className="font-mono text-[0.5625rem] text-muted-foreground/80">
              Choke
            </span>
          </div>
          <div className="fsv8-area-chart-wrap relative min-h-0 flex-1">
            <MiniAreaChart points={zone.areaPoints} />
            <span
              className="fsv8-choke-mark pointer-events-none absolute bottom-1 top-1 w-px bg-(--pp-accent)/35"
              style={{ left: chokeLeft }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </MockScreen>
  )
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function DataTableZone({
  zone,
  live,
  activeRowIndex,
}: {
  zone: Extract<MiniAppScreenZone, { type: "data-table" }>
  live: boolean
  pulseKey: number
  activeRowIndex: number
}) {
  return (
    <MockScreen>
      <div className="fsv8-table flex min-h-0 w-full flex-1 flex-col font-mono text-[0.625rem]">
        <div className="fsv8-table-head grid shrink-0 grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] items-center gap-2 border-b border-(--pp-border) px-3 py-2 text-muted-foreground">
          {zone.columns.map((column) => (
            <span key={column.header} className="truncate">
              {titleCase(column.header)}
            </span>
          ))}
        </div>

        <div className="fsv8-table-rows flex min-h-0 flex-1 flex-col">
          {zone.rows.map((row, rowIndex) => {
            const isActive = live && rowIndex === activeRowIndex

            return (
              <div
                key={rowIndex}
                className={cn(
                  "fsv8-table-row grid min-h-0 flex-1 grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] items-center gap-2 border-b border-(--pp-border) px-3 text-foreground/80 last:border-b-0",
                  isActive && "fsv8-table-row-live"
                )}
              >
                <span className="truncate text-foreground/90">
                  {titleCase(row.cells[0] ?? "")}
                </span>
                <span className="truncate text-muted-foreground">
                  {titleCase(row.cells[1] ?? "")}
                </span>
                <span
                  className={cn(
                    "truncate tabular-nums",
                    isActive ? "text-foreground" : "text-foreground/70"
                  )}
                >
                  {row.cells[2]}
                </span>
              </div>
            )
          })}
        </div>

        <div
          className="fsv8-table-foot shrink-0 border-t border-(--pp-border) px-3 py-2"
          aria-hidden
        >
          {"\u00A0"}
        </div>
      </div>
    </MockScreen>
  )
}

type LivePreviewProps = {
  live: boolean
  pulseKey: number
  activeNodeIndex: number
  activeRowIndex: number
  instanceId: string
}

function DashboardZone({
  zone,
  live,
  instanceId,
}: LivePreviewProps & {
  zone: Extract<MiniAppScreenZone, { type: "dashboard" }>
}) {
  return (
    <MockScreen>
      <div className="grid shrink-0 grid-cols-2 border-b border-(--pp-border)">
        {zone.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            value={metric.value}
            label={metric.label}
            valueClassName={live ? "fsv8-stat-live" : undefined}
          />
        ))}
      </div>
      {zone.bars ? (
        <MiniBarChart heights={zone.bars} live={live} seed={`${instanceId}-dash`} />
      ) : null}
      {zone.dotGrid ? (
        <DotGridPanel dotGrid={zone.dotGrid} live={live} seed={`${instanceId}-dash-dots`} />
      ) : null}
    </MockScreen>
  )
}

function ChartDashboardZone({
  zone,
  live,
  instanceId,
}: LivePreviewProps & {
  zone: Extract<MiniAppScreenZone, { type: "chart-dashboard" }>
}) {
  const { chart } = zone
  const values = chartValues(chart)

  return (
    <MockScreen>
      <div className="grid shrink-0 grid-cols-2 border-b border-(--pp-border)">
        {zone.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            value={metric.value}
            label={metric.label}
            valueClassName={live ? "fsv8-stat-live" : undefined}
          />
        ))}
      </div>
      {chart.type === "dots" && zone.dotGrid ? (
        <DotGridPanel dotGrid={zone.dotGrid} live={live} seed={`${instanceId}-chart-dots`} />
      ) : chart.type === "line" || chart.type === "sparkline" ? (
        <div
          className={cn(
            "fsv8-line-chart-wrap flex min-h-0 flex-1 px-3 py-3",
            live && "fsv8-area-chart-wrap-live"
          )}
          style={
            live
              ? ({
                  "--fsv8-scan-delay": `${elementDelay(`${instanceId}-line-scan`, 0, 4800)}ms`,
                } as CSSProperties)
              : undefined
          }
        >
          <MiniLineChart points={values} />
        </div>
      ) : chart.type === "area" ? (
        <div
          className={cn(
            "fsv8-area-chart-wrap flex min-h-0 flex-1 px-3 py-3",
            live && "fsv8-area-chart-wrap-live"
          )}
          style={
            live
              ? ({
                  "--fsv8-scan-delay": `${elementDelay(`${instanceId}-area-scan`, 0, 4800)}ms`,
                } as CSSProperties)
              : undefined
          }
        >
          <MiniAreaChart points={values} />
        </div>
      ) : (
        <MiniBarChart
          heights={values}
          thin={chart.barWidth === "thin"}
          live={live}
          seed={`${instanceId}-chart-bars`}
        />
      )}
    </MockScreen>
  )
}

function MiniAppScreen({
  zone,
  live,
  pulseKey,
  activeNodeIndex,
  activeRowIndex,
  instanceId,
}: { zone: MiniAppScreenZone } & LivePreviewProps) {
  const props = { live, pulseKey, activeNodeIndex, activeRowIndex, instanceId }

  if (zone.type === "live-stream") return <LiveStreamZone zone={zone} {...props} />
  if (zone.type === "signal-flow") return <SignalFlowZone zone={zone} {...props} />
  if (zone.type === "health-split") return <HealthSplitZone zone={zone} {...props} />
  if (zone.type === "data-table") return <DataTableZone zone={zone} {...props} />
  if (zone.type === "dashboard") return <DashboardZone zone={zone} {...props} />
  return <ChartDashboardZone zone={zone} {...props} />
}

export default function ProductPreviewFeature({
  spec,
  title,
  description,
  instanceId,
  live = false,
  className,
}: {
  spec: FeaturePreviewSpec
  title: string
  description: string
  instanceId: string
  live?: boolean
  className?: string
}) {
  const initialZone = spec.zones[0]
  const preview = useLiveFeaturePreview(initialZone, live, instanceId)

  return (
    <div
      className={cn(
        "fsv8-mock-frame relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-(--pp-shell-bg)",
        className
      )}
      role="img"
      aria-label={`${title} — ${description}${live ? " — simulated live data" : ""}`}
    >
      {preview.zone ? (
        <MiniAppScreen
          zone={preview.zone}
          live={live}
          pulseKey={preview.pulseKey}
          activeNodeIndex={preview.activeNodeIndex}
          activeRowIndex={preview.activeRowIndex}
          instanceId={instanceId}
        />
      ) : null}
    </div>
  )
}
