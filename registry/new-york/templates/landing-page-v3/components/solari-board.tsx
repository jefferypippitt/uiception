"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"

import {
  boardGapPx,
  boardNaturalSize,
  fitBoardFrame,
  fitBoardScale,
  padBoard,
  TARGET_CELL_PX,
} from "../lib/board"
import { SolariCell } from "./solari-cell"

import "../styles/solari.css"

const TILE_SETTLE_MS = 140

type Frame = {
  cols: number
  rows: number
  gap: number
}

type SolariBoardProps = {
  rows: string[]
  rowIds?: string[]
  cols: number
  instant?: boolean
  speed?: "normal" | "fast"
  fill?: boolean
  ariaLabel: string
}

function readRem(): number {
  return (
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  )
}

export function SolariBoard({
  rows,
  rowIds,
  cols,
  instant = false,
  speed = "normal",
  fill = false,
  ariaLabel,
}: SolariBoardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const initialFrame: Frame = { cols, rows: rows.length, gap: 4 }
  const frameRef = useRef<Frame>(initialFrame)
  const [frame, setFrame] = useState<Frame>(initialFrame)
  const [measured, setMeasured] = useState(!fill)
  const [snap, setSnap] = useState(false)

  const ids =
    rowIds && rowIds.length === rows.length
      ? rowIds
      : rows.map((_, i) => `row-${i}`)

  useLayoutEffect(() => {
    if (!fill) return
    const el = rootRef.current
    if (!el) return

    const paintScale = (
      tileCols: number,
      tileRows: number,
      gap: number,
      width: number,
      height: number
    ) => {
      const natural = boardNaturalSize(tileCols, tileRows, gap)
      const scale = fitBoardScale(width, height, tileCols, tileRows, gap)
      const sizer = sizerRef.current
      const grid = gridRef.current
      if (sizer) {
        sizer.style.width = `${natural.width * scale}px`
        sizer.style.height = `${natural.height * scale}px`
      }
      if (grid) {
        grid.style.width = `${natural.width}px`
        grid.style.gap = `${gap}px`
        grid.style.transform = `scale(${scale})`
      }
    }

    const applyTiles = () => {
      const gap = boardGapPx(el.clientWidth, readRem())
      const tiles = fitBoardFrame(
        el.clientWidth,
        el.clientHeight,
        cols,
        rows.length,
        gap
      )
      const next = { cols: tiles.cols, rows: tiles.rows, gap }
      const changed =
        next.cols !== frameRef.current.cols ||
        next.rows !== frameRef.current.rows ||
        next.gap !== frameRef.current.gap
      paintScale(next.cols, next.rows, next.gap, el.clientWidth, el.clientHeight)
      setMeasured(true)
      if (!changed) return
      frameRef.current = next
      setSnap(true)
      setFrame(next)
    }

    applyTiles()

    let tileTimer: ReturnType<typeof setTimeout> | undefined
    const observer = new ResizeObserver(() => {
      const gap = boardGapPx(el.clientWidth, readRem())
      paintScale(
        frameRef.current.cols,
        frameRef.current.rows,
        gap,
        el.clientWidth,
        el.clientHeight
      )
      if (tileTimer) clearTimeout(tileTimer)
      tileTimer = setTimeout(applyTiles, TILE_SETTLE_MS)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (tileTimer) clearTimeout(tileTimer)
    }
  }, [fill, cols, rows.length])

  useEffect(() => {
    if (!snap) return
    const id = requestAnimationFrame(() => setSnap(false))
    return () => cancelAnimationFrame(id)
  }, [snap])

  const layout = fill
    ? padBoard({ rows, cols, rowIds: ids }, frame.cols, frame.rows)
    : { rows, cols, rowIds: ids }

  const style: CSSProperties | undefined = fill
    ? {
        opacity: measured ? 1 : 0,
      }
    : undefined

  const grid = (
    <div
      ref={fill ? gridRef : undefined}
      className="solari-grid"
      style={
        {
          gridTemplateColumns: fill
            ? `repeat(${layout.cols}, ${TARGET_CELL_PX}px)`
            : `repeat(${layout.cols}, minmax(0, 1fr))`,
          gap: fill ? frame.gap : undefined,
          ...(fill ? { "--solari-cell-size": `${TARGET_CELL_PX}px` } : {}),
        } as CSSProperties
      }
    >
      {layout.rows.map((row, r) => {
        const id = layout.rowIds[r] ?? `row-${r}`
        return (
          <div
            key={id}
            className="solari-row"
            style={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "subgrid",
            }}
          >
            {row
              .padEnd(layout.cols, " ")
              .slice(0, layout.cols)
              .split("")
              .map((ch, c) => (
                <SolariCell
                  key={`${id}-${c}`}
                  value={ch}
                  instant={instant || snap}
                  speed={speed}
                />
              ))}
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={fill ? "solari-board solari-board-fill" : "solari-board"}
      style={style}
      role="img"
      aria-label={ariaLabel}
    >
      <svg className="solari-defs" aria-hidden>
        <filter
          id="solari-paper-grain"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
      {fill ? (
        <div ref={sizerRef} className="solari-sizer">
          {grid}
        </div>
      ) : (
        grid
      )}
    </div>
  )
}
