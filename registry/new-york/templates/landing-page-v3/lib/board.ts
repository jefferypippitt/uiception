import { padDigits, type CountdownParts } from "./countdown"

export const BOARD_COLS = 23

const MAX_HEADING_LINES = 3
const MAX_NAME_LINES = 2

export const UNIT_KEYS = ["days", "hours", "minutes", "seconds"] as const
export type UnitKey = (typeof UNIT_KEYS)[number]

const UNIT_PADDED: Record<UnitKey, boolean> = {
  days: false,
  hours: true,
  minutes: true,
  seconds: true,
}

export function activeUnitKeys(parts: CountdownParts): UnitKey[] {
  return UNIT_KEYS.filter((key) => key === "seconds" || parts[key] !== 0)
}

export type BoardSite = {
  headline: string
  name: string
  units: readonly string[]
}

export type BoardLayout = {
  rows: string[]
  cols: number
  rowIds: string[]
}

export const UNIT_SLOT_COUNT = UNIT_KEYS.length

export const TARGET_CELL_PX = 40
export const CELL_ASPECT = 4 / 3
const MAX_FRAME_COLS = 45
const MAX_FRAME_ROWS = 28

export function boardGapPx(viewportWidth: number, rem = 16): number {
  return Math.min(0.3 * rem, Math.max(0.16 * rem, 0.005 * viewportWidth))
}

export function boardNaturalSize(
  cols: number,
  rows: number,
  gap: number
): { width: number; height: number } {
  return {
    width: cols * TARGET_CELL_PX + Math.max(0, cols - 1) * gap,
    height: rows * TARGET_CELL_PX * CELL_ASPECT + Math.max(0, rows - 1) * gap,
  }
}

export function fitBoardScale(
  frameWidth: number,
  frameHeight: number,
  cols: number,
  rows: number,
  gap: number
): number {
  const natural = boardNaturalSize(cols, rows, gap)
  return Math.min(
    frameWidth / Math.max(1, natural.width),
    frameHeight / Math.max(1, natural.height),
    1
  )
}

export function fitBoardFrame(
  width: number,
  height: number,
  minCols: number,
  minRows: number,
  gap: number
): { cols: number; rows: number } {
  if (width <= 0 || height <= 0) return { cols: minCols, rows: minRows }

  const preferredCols = Math.floor((width + gap) / (TARGET_CELL_PX + gap))
  if (preferredCols < minCols) {
    return { cols: minCols, rows: minRows }
  }

  const cols = Math.min(MAX_FRAME_COLS, preferredCols)
  const cellH = TARGET_CELL_PX * CELL_ASPECT
  const rows = Math.min(
    MAX_FRAME_ROWS,
    Math.max(minRows, Math.floor((height + gap) / (cellH + gap)))
  )

  return { cols, rows }
}

export function padBoard(
  layout: BoardLayout,
  targetCols: number,
  targetRows: number
): BoardLayout {
  const cols = Math.max(layout.cols, targetCols)
  const rowCount = Math.max(layout.rows.length, targetRows)
  const extraX = cols - layout.cols
  const left = Math.floor(extraX / 2)
  const extraY = rowCount - layout.rows.length
  const top = Math.floor(extraY / 2)
  const blank = " ".repeat(cols)
  const padded = layout.rows.map((row) => {
    const inner = row.padEnd(layout.cols, " ").slice(0, layout.cols)
    return `${" ".repeat(left)}${inner}${" ".repeat(cols - left - layout.cols)}`
  })
  const topIds = Array.from({ length: top }, (_, i) => `pad-top-${i}`)
  const bottomIds = Array.from(
    { length: rowCount - top - padded.length },
    (_, i) => `pad-bottom-${i}`
  )
  return {
    cols,
    rows: [
      ...Array.from({ length: top }, () => blank),
      ...padded,
      ...Array.from({ length: rowCount - top - padded.length }, () => blank),
    ],
    rowIds: [...topIds, ...layout.rowIds, ...bottomIds],
  }
}

export function centerIn(text: string, width: number): string {
  const trimmed = text.slice(0, width)
  const pad = width - trimmed.length
  const left = Math.floor(pad / 2)
  return `${" ".repeat(left)}${trimmed}${" ".repeat(pad - left)}`
}

export function wrapToRows(text: string, cols: number, maxLines = Infinity): string[] {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ""

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > cols) {
      if (line) lines.push(line)
      line = word.length > cols ? word.slice(0, cols) : word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  if (lines.length === 0) return [""]

  if (lines.length <= maxLines) return lines

  const kept = lines.slice(0, maxLines)
  const last = kept[maxLines - 1]!
  kept[maxLines - 1] =
    last.length >= cols ? `${last.slice(0, cols - 1)}…` : `${last}…`
  return kept
}

export function wrapBalanced(text: string, width: number, maxLines = Infinity): string[] {
  const greedy = wrapToRows(text, width, maxLines)
  if (greedy.length <= 1) return greedy

  const words = text.toUpperCase().split(/\s+/).filter(Boolean)
  const minWidth = Math.max(
    1,
    ...words.map((word) => Math.min(word.length, width))
  )
  let lo = minWidth
  let hi = width
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (wrapToRows(text, mid, Infinity).length <= greedy.length) hi = mid
    else lo = mid + 1
  }
  return wrapToRows(text, lo, maxLines)
}

export function firstGapIndex(row: string): number {
  const start = row.search(/\S/)
  if (start < 0) return Math.floor(row.length / 2)
  const gap = row.indexOf(" ", start)
  return gap >= 0 ? gap : Math.floor(row.length / 2)
}

function splitPair(text: string): { left: string; right: string } {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return { left: "", right: "" }
  if (words.length === 1) return { left: words[0]!, right: "" }
  return { left: words[0]!, right: words.slice(1).join(" ") }
}

export function placeAtAxis(
  left: string,
  right: string,
  cols: number,
  axis: number
): string {
  const cells = Array.from({ length: cols }, () => " ")
  const leftStart = axis - left.length
  for (let i = 0; i < left.length; i++) {
    const col = leftStart + i
    if (col >= 0 && col < axis) cells[col] = left[i]!
  }
  for (let i = 0; i < right.length; i++) {
    const col = axis + 1 + i
    if (col >= 0 && col < cols) cells[col] = right[i]!
  }
  return cells.join("")
}

export function unitValue(key: UnitKey, parts: CountdownParts): string {
  return UNIT_PADDED[key]
    ? padDigits(parts[key], 2)
    : String(Math.max(0, Math.floor(parts[key])))
}

export type UnitOverride = { left?: string; right?: string }

export type LayoutBoardOptions = {
  unitKeys?: readonly UnitKey[]
  unitOverrides?: Partial<Record<UnitKey, UnitOverride>>
}

export function layoutBoard(
  site: BoardSite,
  parts: CountdownParts,
  cols: number = BOARD_COLS,
  options?: LayoutBoardOptions
): BoardLayout {
  const width = cols
  const blank = " ".repeat(width)

  const headlinePairs = wrapBalanced(site.headline, width, MAX_HEADING_LINES).map(
    splitPair
  )
  const namePair = splitPair(site.name)
  const keys = options?.unitKeys ?? activeUnitKeys(parts)
  const unitPairs = keys.map((key) => {
    const override = options?.unitOverrides?.[key]
    const i = UNIT_KEYS.indexOf(key)
    return {
      key,
      left: override?.left ?? unitValue(key, parts),
      right: override?.right ?? (site.units[i] ?? "").toUpperCase(),
    }
  })

  const padCount = Math.max(0, UNIT_SLOT_COUNT - unitPairs.length)
  const slotPairs = [
    ...unitPairs,
    ...Array.from({ length: padCount }, () => ({
      key: null as UnitKey | null,
      left: "",
      right: "",
    })),
  ]

  const pairs = [
    ...headlinePairs,
    namePair,
    ...slotPairs.map(({ left, right }) => ({ left, right })),
  ]
  const maxLeft = Math.max(1, ...pairs.map((pair) => pair.left.length))
  const maxRight = Math.max(0, ...pairs.map((pair) => pair.right.length))
  const contentWidth = Math.min(width, maxLeft + 1 + maxRight)
  const leftPad = Math.max(0, Math.floor((width - contentWidth) / 2) - 1)
  const axis = leftPad + maxLeft

  const nameRightWidth = Math.max(1, width - axis - 1)
  const nameRows = wrapToRows(namePair.right, nameRightWidth, MAX_NAME_LINES).map(
    (line, i) => placeAtAxis(i === 0 ? namePair.left : "", line, width, axis)
  )

  const unitRows = slotPairs.map((pair) =>
    pair.key === null
      ? blank
      : placeAtAxis(pair.left, pair.right, width, axis)
  )

  const unitRowIds = slotPairs.map((_, i) => `unit-slot-${i}`)

  const rows = [
    blank,
    ...headlinePairs.map((pair) => placeAtAxis(pair.left, pair.right, width, axis)),
    blank,
    ...nameRows,
    blank,
    ...unitRows,
    blank,
  ]

  const rowIds = [
    "spacer-top",
    ...headlinePairs.map((_, i) => `headline-${i}`),
    "spacer-after-headline",
    ...nameRows.map((_, i) => `name-${i}`),
    "spacer-before-units",
    ...unitRowIds,
    "spacer-bottom",
  ]

  return { rows, cols: width, rowIds }
}

export function buildBoardRows(
  site: BoardSite,
  parts: CountdownParts,
  cols?: number
): string[] {
  return layoutBoard(site, parts, cols).rows
}
