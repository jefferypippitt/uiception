"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react"

import {
  activeUnitKeys,
  BOARD_COLS,
  layoutBoard,
  UNIT_KEYS,
  unitValue,
  type UnitKey,
} from "../lib/board"
import { remainingParts, type CountdownParts } from "../lib/countdown"
import { site } from "../lib/site"
import { SolariBoard } from "./solari-board"
import { SOLARI_FLIP_MS } from "./solari-cell"

const SPIN_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const ZERO_PARTS: CountdownParts = { days: 0, hours: 0, minutes: 0, seconds: 0 }

const SHUFFLE_STEPS = 4
const STAGGER_MS = 4
const UNIT_FLAP_STAGGER_MS = 42

const emptySubscribe = () => () => {}

function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

function useReducedMotion() {
  return useSyncExternalStore(
    emptySubscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )
}

function randomGlyph(exclude: string): string {
  let glyph = SPIN_GLYPHS[Math.floor(Math.random() * SPIN_GLYPHS.length)] ?? "A"
  let guard = 0
  while (glyph === exclude && guard++ < 5) {
    glyph = SPIN_GLYPHS[Math.floor(Math.random() * SPIN_GLYPHS.length)] ?? "A"
  }
  return glyph
}

type UnitOverride = { key: UnitKey; left: string; right: string }

type QueuedOp = { type: "drop" | "add"; key: UnitKey }

function useUnitRows(
  parts: CountdownParts,
  enabled: boolean,
  reducedMotion: boolean
) {
  const [activeKeys, setActiveKeys] = useState<readonly UnitKey[]>(UNIT_KEYS)
  const [override, setOverride] = useState<UnitOverride | null>(null)
  const [queueTick, setQueueTick] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const activeKeysRef = useRef(activeKeys)
  const partsRef = useRef(parts)
  const lastVisibleValuesRef = useRef<CountdownParts>(parts)
  const busyRef = useRef(false)
  const queueRef = useRef<QueuedOp[]>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const drainQueueRef = useRef<() => void>(() => {})
  const snapToRef = useRef<(desired: readonly UnitKey[]) => void>(() => {})

  if (enabled && !initialized) {
    setInitialized(true)
    setActiveKeys(activeUnitKeys(parts))
  }

  useEffect(() => {
    partsRef.current = parts
    for (const key of UNIT_KEYS) {
      if (key === "seconds" || parts[key] !== 0) {
        lastVisibleValuesRef.current[key] = parts[key]
      }
    }
  })

  useEffect(() => {
    activeKeysRef.current = activeKeys
  }, [activeKeys])

  const clearTimers = () => {
    for (const t of timersRef.current) clearTimeout(t)
    timersRef.current = []
  }

  const unitCopy = (key: UnitKey) => ({
    left: unitValue(key, {
      ...partsRef.current,
      [key]: lastVisibleValuesRef.current[key],
    }),
    right: (site.units[UNIT_KEYS.indexOf(key)] ?? "").toUpperCase(),
  })

  const replaceChar = (value: string, index: number, char: string) =>
    `${value.slice(0, index)}${char}${value.slice(index + 1)}`

  const setOverrideChar = (
    key: UnitKey,
    side: "left" | "right",
    index: number,
    char: string
  ) => {
    setOverride((current) => {
      if (!current || current.key !== key) return current
      return {
        ...current,
        [side]: replaceChar(current[side], index, char),
      }
    })
  }

  const scheduleFlapScramble = (
    key: UnitKey,
    copy: { left: string; right: string },
    direction: "out" | "in",
    startDelay = 0
  ) => {
    const flaps = (["left", "right"] as const).flatMap((side) =>
      copy[side].split("").map((char, index) => ({ side, index, char }))
    )

    flaps.forEach(({ side, index, char }, flapIndex) => {
      const base = startDelay + flapIndex * UNIT_FLAP_STAGGER_MS
      let previous = direction === "out" ? char : " "

      for (let step = 0; step < SHUFFLE_STEPS; step++) {
        const glyph = randomGlyph(previous)
        previous = glyph
        timersRef.current.push(
          setTimeout(
            () => setOverrideChar(key, side, index, glyph),
            base + step * SOLARI_FLIP_MS.fast
          )
        )
      }

      timersRef.current.push(
        setTimeout(
          () =>
            setOverrideChar(
              key,
              side,
              index,
              direction === "out" ? " " : char
            ),
          base + SHUFFLE_STEPS * SOLARI_FLIP_MS.fast
        )
      )
    })

    const lastFlapDelay = Math.max(0, flaps.length - 1) * UNIT_FLAP_STAGGER_MS
    return (
      startDelay +
      lastFlapDelay +
      (SHUFFLE_STEPS + 1) * SOLARI_FLIP_MS.fast
    )
  }

  const release = (delay: number) => {
    timersRef.current.push(
      setTimeout(() => {
        busyRef.current = false
        setQueueTick((n) => n + 1)
      }, delay)
    )
  }

  const runDrop = (key: UnitKey) => {
    busyRef.current = true
    clearTimers()

    const copy = unitCopy(key)
    setOverride({ key, ...copy })
    const scrambleMs = scheduleFlapScramble(key, copy, "out")

    timersRef.current.push(
      setTimeout(() => {
        setOverride(null)
        setActiveKeys(activeKeysRef.current.filter((k) => k !== key))
      }, scrambleMs)
    )

    release(scrambleMs)
  }

  const runAdd = (key: UnitKey) => {
    busyRef.current = true
    clearTimers()

    const copy = unitCopy(key)
    const withKey = UNIT_KEYS.filter(
      (k) => k === key || activeKeysRef.current.includes(k)
    )

    setOverride({
      key,
      left: " ".repeat(copy.left.length),
      right: " ".repeat(copy.right.length),
    })
    setActiveKeys(withKey)

    const scrambleMs = scheduleFlapScramble(key, copy, "in")

    timersRef.current.push(
      setTimeout(() => setOverride(null), scrambleMs)
    )

    release(scrambleMs)
  }

  const drainQueue = () => {
    if (busyRef.current) return

    while (queueRef.current.length > 0) {
      const op = queueRef.current.shift()!
      const current = activeKeysRef.current
      const desired = activeUnitKeys(partsRef.current)

      if (op.type === "drop") {
        if (!current.includes(op.key) || desired.includes(op.key)) continue
        runDrop(op.key)
        return
      }

      if (current.includes(op.key) || !desired.includes(op.key)) continue
      runAdd(op.key)
      return
    }
  }

  const enqueue = (op: QueuedOp) => {
    queueRef.current = queueRef.current.filter(({ key }) => key !== op.key)
    queueRef.current.push(op)
    queueRef.current.sort(
      (a, b) => UNIT_KEYS.indexOf(a.key) - UNIT_KEYS.indexOf(b.key)
    )
  }

  const snapTo = (desired: readonly UnitKey[]) => {
    clearTimers()
    queueRef.current = []
    busyRef.current = false
    queueMicrotask(() => {
      setOverride(null)
      setActiveKeys(desired)
    })
  }

  useEffect(() => {
    drainQueueRef.current = drainQueue
    snapToRef.current = snapTo
  })

  useEffect(() => {
    if (!enabled || !initialized) return

    const desired = activeUnitKeys(parts)

    if (reducedMotion) {
      snapToRef.current(desired)
      return
    }

    const current = activeKeysRef.current

    for (const key of current) {
      if (!desired.includes(key)) enqueue({ type: "drop", key })
    }
    for (const key of desired) {
      if (!current.includes(key)) enqueue({ type: "add", key })
    }

    drainQueueRef.current()
  }, [parts, enabled, reducedMotion, initialized])

  useEffect(() => {
    if (!enabled || busyRef.current) return
    if (queueRef.current.length === 0) return
    drainQueueRef.current()
  }, [enabled, queueTick])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [])

  return { activeKeys, override }
}

function useBoardReveal(
  target: string[] | null,
  cols: number,
  reducedMotion: boolean
) {
  const [rows, setRows] = useState<string[] | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!target) return

    const blank = " ".repeat(cols)
    setRows(target.map(() => blank))

    const timers: ReturnType<typeof setTimeout>[] = []

    if (reducedMotion) {
      timers.push(
        setTimeout(() => {
          setRows(target)
          setDone(true)
        }, 0)
      )
      return () => {
        for (const t of timers) clearTimeout(t)
      }
    }

    const setCell = (r: number, c: number, char: string) => {
      setRows((prev) => {
        if (!prev) return prev
        const next = [...prev]
        const chars = next[r]!.split("")
        chars[c] = char
        next[r] = chars.join("")
        return next
      })
    }

    let cellIndex = 0
    let lastLandDelay = 0

    target.forEach((rowStr, r) => {
      rowStr.split("").forEach((finalChar, c) => {
        const index = cellIndex++
        if (finalChar === " ") return

        const base = index * STAGGER_MS
        let prevGlyph = " "

        for (let step = 0; step < SHUFFLE_STEPS; step++) {
          const glyph = randomGlyph(prevGlyph)
          prevGlyph = glyph
          timers.push(
            setTimeout(
              () => setCell(r, c, glyph),
              base + step * SOLARI_FLIP_MS.fast
            )
          )
        }

        const landDelay = base + SHUFFLE_STEPS * SOLARI_FLIP_MS.fast
        lastLandDelay = Math.max(lastLandDelay, landDelay)
        timers.push(setTimeout(() => setCell(r, c, finalChar), landDelay))
      })
    })

    timers.push(
      setTimeout(
        () => setDone(true),
        lastLandDelay + SOLARI_FLIP_MS.fast + 100
      )
    )

    return () => {
      for (const t of timers) clearTimeout(t)
    }
  }, [target, cols, reducedMotion])

  return { rows, done }
}

export function CountdownHero() {
  const hydrated = useHydrated()
  const [parts, setParts] = useState<CountdownParts>(ZERO_PARTS)
  const [revealTarget, setRevealTarget] = useState<string[] | null>(null)
  const [revealRowIds, setRevealRowIds] = useState<string[] | null>(null)

  useEffect(() => {
    if (!hydrated) return

    const startId = window.setTimeout(() => {
      const initialParts = remainingParts(site.targetDate, new Date())
      setParts(initialParts)
      const board = layoutBoard(site, initialParts)
      setRevealTarget(board.rows)
      setRevealRowIds(board.rowIds)
    }, 0)

    const tickId = window.setInterval(() => {
      setParts(remainingParts(site.targetDate, new Date()))
    }, 1000)

    return () => {
      clearTimeout(startId)
      clearInterval(tickId)
    }
  }, [hydrated])

  const reducedMotion = useReducedMotion()

  const { activeKeys, override } = useUnitRows(
    parts,
    revealTarget !== null,
    reducedMotion
  )

  const live = useMemo(() => {
    const unitOverrides = override
      ? { [override.key]: { left: override.left, right: override.right } }
      : undefined
    return layoutBoard(site, parts, BOARD_COLS, {
      unitKeys: activeKeys,
      unitOverrides,
    })
  }, [parts, activeKeys, override])

  const { rows: revealRows, done: revealDone } = useBoardReveal(
    revealTarget,
    live.cols,
    reducedMotion
  )

  const blankRows = useMemo(
    () => live.rows.map(() => " ".repeat(live.cols)),
    [live]
  )

  const boardRows = revealDone ? live.rows : (revealRows ?? blankRows)
  const boardRowIds = revealDone
    ? live.rowIds
    : (revealRowIds ?? live.rowIds)

  const ariaLabel = hydrated
    ? `${site.headline} ${site.name}. ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds until ${site.name}.`
    : `${site.headline} ${site.name}.`

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background text-foreground">
      <div
        className="hero-reveal h-full w-full"
        style={{ "--hero-delay": "60ms" } as CSSProperties}
      >
        <SolariBoard
          rows={boardRows}
          rowIds={boardRowIds}
          cols={live.cols}
          instant={reducedMotion}
          speed={revealDone ? "normal" : "fast"}
          fill
          ariaLabel={ariaLabel}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {hydrated
          ? `${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds remaining until ${site.name}`
          : `Countdown until ${site.name}`}
      </p>
    </section>
  )
}
