/**
 * Spreadsheet animation — semiconductor positions:
 * revise Intel price target → add TSM row (typed inputs + Excel-style formulas for value & return).
 */

export type SpreadsheetPhase =
  | "setup"
  | "cursorMove"
  | "select"
  | "typing"
  | "commit"
  | "tsmPrep"
  | "tsmMove0"
  | "tsmType0"
  | "tsmMove1"
  | "tsmType1"
  | "tsmMove2"
  | "tsmType2"
  | "tsmMove3"
  | "tsmType3"
  | "tsmMove4"
  | "tsmType4"
  | "holding"
  | "resetting"

const PHASE_NEXT: Record<SpreadsheetPhase, SpreadsheetPhase> = {
  setup: "cursorMove",
  cursorMove: "select",
  select: "typing",
  typing: "commit",
  commit: "tsmPrep",
  tsmPrep: "tsmMove0",
  tsmMove0: "tsmType0",
  tsmType0: "tsmMove1",
  tsmMove1: "tsmType1",
  tsmType1: "tsmMove2",
  tsmMove2: "tsmType2",
  tsmType2: "tsmMove3",
  tsmMove3: "tsmType3",
  tsmType3: "tsmMove4",
  tsmMove4: "tsmType4",
  tsmType4: "holding",
  holding: "resetting",
  resetting: "setup",
}

export const PHASE_NEXT_MAP = PHASE_NEXT

/** Character cadence + padding so phase timers outlive typing timers. */
const TSM_CHAR_MS = 132
const TSM_TYPE_PAD = 360

/** Visible data columns A–E; F–H stay blank in the mock. */
export const DATA_COLUMN_COUNT = 5 as const

/** Row shape — TSM row uses Excel row 5 in formulas (`B5`, `C5`, `D5`). */
export type RowData = {
  id: string
  account: string
  arr: string
  growth: string
  marketValue: string
  gainLoss: string
}

/** 0-based Intel row — price cell edited before TSM sync. */
export const EDIT_CELL = { row: 2, col: 1 }

/** Prior print → today’s price (Illustrative — align with `INITIAL_ROWS` INTC row.) */
export const EDIT_FROM = "107.95"
export const EDIT_TO = "108.77"

/**
 * Early/core: NVDA, INTC — larger % vs average cost.
 * Later tranches: AMD (underwater top-up), then TSM row (new starter line).
 */
export const INITIAL_ROWS: readonly RowData[] = [
  {
    id: "r1",
    account: "NVDA",
    arr: "225.32",
    growth: "38",
    marketValue: "8,562.16",
    gainLoss: "+245.3%",
  },
  {
    id: "r2",
    account: "AMD",
    arr: "424.10",
    growth: "12",
    marketValue: "5,089.20",
    gainLoss: "-7.8%",
  },
  {
    id: "r3",
    account: "INTC",
    arr: EDIT_FROM,
    growth: "85",
    marketValue: "9,175.75",
    gainLoss: "+52.1%",
  },
]

/** Newer TSM line — shares typed; value & % from formulas vs cost. */
export const SYNC_ROW: RowData = {
  id: "r4",
  account: "TSM",
  arr: "404.35",
  growth: "9",
  marketValue: "3,639.15",
  gainLoss: "+6.4%",
}

export const TSM_MKT_FORMULA = "=B5*C5" as const
/** Cost basis $3,420 — later buy; ~+6.4% vs `D5` at `404.35` × 9 shares. */
export const TSM_GL_FORMULA = "=(D5-3420)/3420" as const

function tsmValueTypeMs(len: number): number {
  return 170 + len * TSM_CHAR_MS + TSM_TYPE_PAD
}

function tsmFormulaTypeMs(formula: string): number {
  return 170 + formula.length * TSM_CHAR_MS + TSM_TYPE_PAD
}

export const TIMING: Record<SpreadsheetPhase, number> = {
  setup: 700,
  cursorMove: 900,
  select: 400,
  typing: 1400,
  commit: 600,
  tsmPrep: 400,
  tsmMove0: 660,
  tsmType0: tsmValueTypeMs(SYNC_ROW.account.length),
  tsmMove1: 640,
  tsmType1: tsmValueTypeMs(SYNC_ROW.arr.length),
  tsmMove2: 620,
  tsmType2: tsmValueTypeMs(SYNC_ROW.growth.length),
  tsmMove3: 620,
  tsmType3: tsmFormulaTypeMs(TSM_MKT_FORMULA),
  tsmMove4: 620,
  tsmType4: tsmFormulaTypeMs(TSM_GL_FORMULA),
  holding: 3000,
  resetting: 400,
}

export const VISIBLE_COLS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const
/** Data columns only — used on narrow viewports (F–H stay blank on desktop). */
export const COMPACT_VISIBLE_COLS = VISIBLE_COLS.slice(0, DATA_COLUMN_COUNT)
export const VISIBLE_ROW_COUNT = 8

export type SpreadsheetGridMetrics = {
  dataColCount: number
  rowNumRem: number
  colLetterRowRem: number
  sheetHeaderRowRem: number
  dataRowRem: number
}

export const GRID_METRICS_DESKTOP: SpreadsheetGridMetrics = {
  dataColCount: VISIBLE_COLS.length,
  rowNumRem: 2.5,
  colLetterRowRem: 2.25,
  sheetHeaderRowRem: 2,
  dataRowRem: 2,
}

export const GRID_METRICS_COMPACT: SpreadsheetGridMetrics = {
  dataColCount: DATA_COLUMN_COUNT,
  rowNumRem: 1.75,
  colLetterRowRem: 1.5,
  sheetHeaderRowRem: 1.5,
  dataRowRem: 1.375,
}

/** Column labels rendered in sheet row 1 (A–E); F–H blank in UI. */
export const COLUMN_HEADERS = [
  "Symbol",
  "Price",
  "Quantity",
  "Market value",
  "Gain/Loss",
] as const

/** Appended sync row index in `rows` when visible (sheet row = index + 2). */
export const TSM_DATA_ROW_INDEX = 3

/** Empty placeholders until each cell is filled. */
export const EMPTY_TSM_ROW: RowData = {
  id: "r4",
  account: "",
  arr: "",
  growth: "",
  marketValue: "",
  gainLoss: "",
}

/** `max-w-6xl` sheet width — keeps cursor anchors aligned at default block size. */
const GRID_REF_WIDTH_REM = 72

/** Horizontal center of a 0-based data column as % of the grid overlay width. */
export function gridColumnCenterPercent(
  colIdx: number,
  metrics: SpreadsheetGridMetrics = GRID_METRICS_DESKTOP
): number {
  const { dataColCount, rowNumRem } = metrics
  const flexCol = (GRID_REF_WIDTH_REM - rowNumRem) / dataColCount
  const centerRem = rowNumRem + colIdx * flexCol + flexCol / 2
  return Math.round((centerRem / GRID_REF_WIDTH_REM) * 100)
}

/** Matches default desktop `gridTemplateRows` data tracks in spreadsheet.tsx. */
export const GRID_DATA_ROW_REM = GRID_METRICS_DESKTOP.dataRowRem

/** Extra downward tip nudge on the TSM row (reads high vs Intel row). */
export const TSM_CURSOR_Y_NUDGE_REM = 0.5

/** Vertical top of a 0-based data row as % of the grid overlay height. */
export function gridDataRowTopPercent(
  dataRowIdx: number,
  metrics: SpreadsheetGridMetrics = GRID_METRICS_DESKTOP
): number {
  const { colLetterRowRem, sheetHeaderRowRem, dataRowRem } = metrics
  const totalRem =
    colLetterRowRem +
    sheetHeaderRowRem +
    VISIBLE_ROW_COUNT * dataRowRem
  const topRem =
    colLetterRowRem + sheetHeaderRowRem + dataRowIdx * dataRowRem
  return Math.round((topRem / totalRem) * 100)
}

export type SpreadsheetCursorPoint = {
  x: number
  y: number
  /** Added to half-row centering in cursor.tsx (`rem`). */
  yNudgeRem?: number
}

/** Cursor anchors for the animated pointer — recomputed when column layout changes. */
export function getSpreadsheetCursors(
  metrics: SpreadsheetGridMetrics = GRID_METRICS_DESKTOP
) {
  const tsmRowY = gridDataRowTopPercent(TSM_DATA_ROW_INDEX, metrics)
  const editRowY = gridDataRowTopPercent(EDIT_CELL.row, metrics)
  const yNudge =
    metrics === GRID_METRICS_COMPACT ? TSM_CURSOR_Y_NUDGE_REM * 0.6 : TSM_CURSOR_Y_NUDGE_REM

  const tsmByCol: SpreadsheetCursorPoint[] = Array.from(
    { length: DATA_COLUMN_COUNT },
    (_, colIdx) => ({
      x: gridColumnCenterPercent(colIdx, metrics),
      y: tsmRowY,
      yNudgeRem: yNudge,
    })
  )

  return {
    approach: { x: 26, y: Math.max(editRowY - 8, 10) },
    cell: {
      x: gridColumnCenterPercent(EDIT_CELL.col, metrics),
      y: editRowY,
    },
    intelPrep: {
      x: gridColumnCenterPercent(4, metrics),
      y: editRowY,
    },
    tsmByCol,
  }
}

/** 0-based column during TSM move/type phases (null during prep / non-TSM). */
export function tsmPhaseColumn(phase: SpreadsheetPhase): number | null {
  const map: Partial<Record<SpreadsheetPhase, number>> = {
    tsmMove0: 0,
    tsmType0: 0,
    tsmMove1: 1,
    tsmType1: 1,
    tsmMove2: 2,
    tsmType2: 2,
    tsmMove3: 3,
    tsmType3: 3,
    tsmMove4: 4,
    tsmType4: 4,
  }
  return map[phase] ?? null
}

export function isTsmTypingPhase(phase: SpreadsheetPhase): boolean {
  return (
    phase === "tsmType0" ||
    phase === "tsmType1" ||
    phase === "tsmType2" ||
    phase === "tsmType3" ||
    phase === "tsmType4"
  )
}

/** True while a formula is being “typed” in the formula bar (mkt / G·L columns). */
export function isTsmFormulaTypingPhase(phase: SpreadsheetPhase): boolean {
  return phase === "tsmType3" || phase === "tsmType4"
}

/** Selection chrome on the active TSM cell (move + type). */
export function tsmShowsCellChrome(phase: SpreadsheetPhase): boolean {
  return tsmPhaseColumn(phase) !== null
}

/** Formula bar reflects TSM activity (prep shows destination A5 empty). */
export function tsmShowsFormula(phase: SpreadsheetPhase): boolean {
  return (
    phase === "tsmPrep" ||
    phase === "tsmMove0" ||
    phase === "tsmType0" ||
    phase === "tsmMove1" ||
    phase === "tsmType1" ||
    phase === "tsmMove2" ||
    phase === "tsmType2" ||
    phase === "tsmMove3" ||
    phase === "tsmType3" ||
    phase === "tsmMove4" ||
    phase === "tsmType4"
  )
}

/** Desktop cursor layout (default export for static references). */
export const SPREADSHEET_CURSOR = getSpreadsheetCursors(GRID_METRICS_DESKTOP)
export const TSM_CURSOR_BY_COL = SPREADSHEET_CURSOR.tsmByCol
