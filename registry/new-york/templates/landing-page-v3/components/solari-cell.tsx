"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export const SOLARI_FLIP_MS = { normal: 260, fast: 130 } as const

type SolariCellProps = {
  value: string
  instant?: boolean
  speed?: "normal" | "fast"
}

export function SolariEmpty() {
  const nbsp = String.fromCharCode(160)
  return (
    <div className="solari-cell solari-cell-empty" aria-hidden>
      <div className="solari-half solari-half-top solari-static-top">
        <span className="solari-glyph">{nbsp}</span>
      </div>
      <div className="solari-half solari-half-bottom solari-static-bottom">
        <span className="solari-glyph">{nbsp}</span>
      </div>
    </div>
  )
}

export function SolariCell({
  value,
  instant = false,
  speed = "normal",
}: SolariCellProps) {
  const empty = value === " " || value === ""
  const display = empty ? " " : value
  const [current, setCurrent] = useState(display)
  const [previous, setPrevious] = useState(display)
  const [flipping, setFlipping] = useState(false)
  const [flipSeq, setFlipSeq] = useState(0)
  const currentRef = useRef(display)
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flipMs = SOLARI_FLIP_MS[speed]

  useEffect(() => {
    if (display === currentRef.current) return

    const startId = window.setTimeout(() => {
      if (instant) {
        currentRef.current = display
        setPrevious(display)
        setCurrent(display)
        setFlipping(false)
        return
      }

      const from = currentRef.current
      currentRef.current = display
      setPrevious(from)
      setCurrent(display)
      setFlipping(true)
      setFlipSeq((n) => n + 1)

      if (flipTimer.current) clearTimeout(flipTimer.current)
      flipTimer.current = setTimeout(() => {
        setFlipping(false)
        setPrevious(display)
      }, flipMs)
    }, 0)

    return () => {
      clearTimeout(startId)
      if (flipTimer.current) clearTimeout(flipTimer.current)
    }
  }, [display, instant, flipMs])

  const showFlip = flipping && previous !== current
  const style =
    speed === "fast"
      ? ({ "--solari-duration": `${flipMs}ms` } as CSSProperties)
      : undefined

  return (
    <div
      className={`solari-cell${empty ? " solari-cell-empty" : ""}`}
      style={style}
      aria-hidden
    >
      <div className="solari-half solari-half-top solari-static-top">
        <span className="solari-glyph">{current}</span>
      </div>
      <div className="solari-half solari-half-bottom solari-static-bottom">
        <span className="solari-glyph">{showFlip ? previous : current}</span>
      </div>

      {showFlip ? (
        <>
          <div
            key={`top-${flipSeq}`}
            className="solari-half solari-half-top solari-flip-top"
          >
            <span className="solari-glyph">{previous}</span>
          </div>
          <div
            key={`bottom-${flipSeq}`}
            className="solari-half solari-half-bottom solari-flip-bottom"
          >
            <span className="solari-glyph">{current}</span>
          </div>
        </>
      ) : null}
    </div>
  )
}
