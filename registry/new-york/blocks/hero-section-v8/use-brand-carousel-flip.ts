"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  CAROUSEL_CYCLE_MS,
  CAROUSEL_ENTER_ANIM_MS,
  CAROUSEL_EXIT_ANIM_MS,
  CAROUSEL_HOLD_MS,
  CAROUSEL_PAGE_SIZE,
} from "./carousel-timing"

export type ColumnMotionPhase = "idle" | "exit" | "enter"

const IDLE_COLUMNS: ColumnMotionPhase[] = ["idle", "idle", "idle"]

type UseBrandCarouselFlipOptions = {
  pageCount: number
  prefersReducedMotion: boolean
}

export function useBrandCarouselFlip({
  pageCount,
  prefersReducedMotion,
}: UseBrandCarouselFlipOptions) {
  const [pageIndex, setPageIndex] = useState(0)
  const [columnPhases, setColumnPhases] =
    useState<ColumnMotionPhase[]>(IDLE_COLUMNS)
  const [columnsOnNextPage, setColumnsOnNextPage] = useState<boolean[]>(
    () => Array.from({ length: CAROUSEL_PAGE_SIZE }, () => false)
  )
  const timersRef = useRef<number[]>([])
  const intervalRef = useRef<number | undefined>(undefined)

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id)
    }
    timersRef.current = []

    if (intervalRef.current !== undefined) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timersRef.current.push(id)
    return id
  }, [])

  const setColumnPhase = useCallback(
    (columnIndex: number, phase: ColumnMotionPhase) => {
      setColumnPhases((current) => {
        const next = [...current]
        next[columnIndex] = phase
        return next
      })
    },
    []
  )

  const markColumnOnNextPage = useCallback((columnIndex: number) => {
    setColumnsOnNextPage((current) => {
      const next = [...current]
      next[columnIndex] = true
      return next
    })
  }, [])

  const resetColumnFlipState = useCallback(() => {
    setColumnPhases(IDLE_COLUMNS)
    setColumnsOnNextPage(
      Array.from({ length: CAROUSEL_PAGE_SIZE }, () => false)
    )
  }, [])

  const flipColumn = useCallback(
    (columnIndex: number, onDone: () => void) => {
      setColumnPhase(columnIndex, "exit")

      schedule(() => {
        setColumnPhase(columnIndex, "enter")

        schedule(() => {
          markColumnOnNextPage(columnIndex)
          setColumnPhase(columnIndex, "idle")
          onDone()
        }, CAROUSEL_ENTER_ANIM_MS)
      }, CAROUSEL_EXIT_ANIM_MS)
    },
    [markColumnOnNextPage, schedule, setColumnPhase]
  )

  const flip = useCallback(() => {
    if (pageCount <= 1) {
      return
    }

    if (prefersReducedMotion) {
      setPageIndex((current) => (current + 1) % pageCount)
      resetColumnFlipState()
      return
    }

    resetColumnFlipState()

    const runColumn = (columnIndex: number) => {
      if (columnIndex >= CAROUSEL_PAGE_SIZE) {
        setPageIndex((current) => (current + 1) % pageCount)
        resetColumnFlipState()
        return
      }

      flipColumn(columnIndex, () => {
        runColumn(columnIndex + 1)
      })
    }

    runColumn(0)
  }, [
    flipColumn,
    pageCount,
    prefersReducedMotion,
    resetColumnFlipState,
  ])

  useEffect(() => {
    clearTimers()

    schedule(() => {
      setPageIndex(0)
      resetColumnFlipState()
    }, 0)

    schedule(() => {
      flip()
      intervalRef.current = window.setInterval(flip, CAROUSEL_CYCLE_MS)
    }, CAROUSEL_HOLD_MS)

    return clearTimers
  }, [clearTimers, flip, resetColumnFlipState, schedule])

  const nextPageIndex = (pageIndex + 1) % pageCount

  const brandPageForColumn = useCallback(
    (columnIndex: number) => {
      const phase = columnPhases[columnIndex]

      if (phase === "exit") {
        return pageIndex
      }

      if (phase === "enter" || columnsOnNextPage[columnIndex]) {
        return nextPageIndex
      }

      return pageIndex
    },
    [columnPhases, columnsOnNextPage, nextPageIndex, pageIndex]
  )

  return {
    pageIndex,
    columnPhases,
    columnsOnNextPage,
    brandPageForColumn,
  }
}
