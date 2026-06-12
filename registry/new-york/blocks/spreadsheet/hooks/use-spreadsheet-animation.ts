"use client"

import { useEffect, useState } from "react"

import {
  EDIT_CELL,
  EDIT_FROM,
  EDIT_TO,
  EMPTY_TSM_ROW,
  GRID_METRICS_COMPACT,
  GRID_METRICS_DESKTOP,
  INITIAL_ROWS,
  PHASE_NEXT_MAP,
  SYNC_ROW,
  TIMING,
  TSM_DATA_ROW_INDEX,
  TSM_GL_FORMULA,
  TSM_MKT_FORMULA,
  VISIBLE_COLS,
  getSpreadsheetCursors,
  isTsmFormulaTypingPhase,
  isTsmTypingPhase,
  tsmPhaseColumn,
  tsmShowsCellChrome,
  tsmShowsFormula,
  type RowData,
  type SpreadsheetCursorPoint,
  type SpreadsheetPhase,
} from "../lib/config"

const TSM_VALUE_KEYS = ["account", "price", "qty"] as const

/** Matches TIMING field cadence in config (`TSM_CHAR_MS`). */
const TSM_CHAR_MS = 132

function parseUsd(s: string): number {
  return Number.parseFloat(s.replace(/,/g, ""))
}

function parsePctSigned(s: string): number {
  return Number.parseFloat(s.trim().replace(/%/g, "")) / 100
}

function formatUsdMv(priceStr: string, qtyStr: string): string {
  const mv = Number.parseFloat(priceStr) * Number.parseInt(qtyStr, 10)
  return mv.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatGainLossPct(decimal: number): string {
  const pct = decimal * 100
  const sign = pct >= 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}

export function useSpreadsheetAnimation(active = true, compact = false) {
  const gridMetrics = compact ? GRID_METRICS_COMPACT : GRID_METRICS_DESKTOP
  const spreadsheetCursor = getSpreadsheetCursors(gridMetrics)
  const [phase, setPhase] = useState<SpreadsheetPhase>("setup")
  const [typed, setTyped] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [commitFlash, setCommitFlash] = useState(false)
  const [tsmDraft, setTsmDraft] = useState<RowData>(() => ({
    ...EMPTY_TSM_ROW,
  }))
  const [tsmFormulaTyping, setTsmFormulaTyping] = useState("")

  useEffect(() => {
    if (!active) {
      setPhase("setup")
      return
    }
    const t = setTimeout(() => setPhase(PHASE_NEXT_MAP[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  useEffect(() => {
    if (!active) return

    if (phase === "setup" || phase === "resetting") {
      setTyped(0)
      setPressed(false)
      setCommitFlash(false)
      setTsmDraft({ ...EMPTY_TSM_ROW })
      setTsmFormulaTyping("")
      return
    }

    if (phase === "tsmPrep") {
      setTyped(EDIT_TO.length)
      setTsmDraft({ ...EMPTY_TSM_ROW })
      setTsmFormulaTyping("")
      return
    }

    if (phase === "select") {
      setPressed(true)
      const t = setTimeout(() => setPressed(false), 180)
      return () => clearTimeout(t)
    }

    if (phase === "typing") {
      setTyped(0)
      const timers: ReturnType<typeof setTimeout>[] = []
      for (let i = 1; i <= EDIT_TO.length; i++) {
        timers.push(setTimeout(() => setTyped(i), 120 + i * 165))
      }
      return () => timers.forEach(clearTimeout)
    }

    if (phase === "commit") {
      setTyped(EDIT_TO.length)
      setCommitFlash(true)
      const t = setTimeout(() => setCommitFlash(false), 480)
      return () => clearTimeout(t)
    }

    if (phase === "tsmType0" || phase === "tsmType1" || phase === "tsmType2") {
      setTyped(EDIT_TO.length)
      setPressed(true)
      const unpress = setTimeout(() => setPressed(false), 180)
      setTsmFormulaTyping("")

      const colMap: Partial<Record<SpreadsheetPhase, number>> = {
        tsmType0: 0,
        tsmType1: 1,
        tsmType2: 2,
      }
      const col = colMap[phase] ?? 0
      const key = TSM_VALUE_KEYS[col]
      const target = SYNC_ROW[key]
      const timers: ReturnType<typeof setTimeout>[] = []
      for (let i = 1; i <= target.length; i++) {
        timers.push(
          setTimeout(() => {
            setTsmDraft((d) => ({
              ...d,
              [key]: target.slice(0, i),
            }))
          }, 155 + i * TSM_CHAR_MS),
        )
      }
      return () => {
        clearTimeout(unpress)
        timers.forEach(clearTimeout)
      }
    }

    if (phase === "tsmType3") {
      setTyped(EDIT_TO.length)
      setPressed(true)
      const unpress = setTimeout(() => setPressed(false), 180)
      setTsmFormulaTyping("")
      const target = TSM_MKT_FORMULA
      const timers: ReturnType<typeof setTimeout>[] = []
      for (let i = 1; i <= target.length; i++) {
        timers.push(
          setTimeout(() => {
            setTsmFormulaTyping(target.slice(0, i))
          }, 155 + i * TSM_CHAR_MS),
        )
      }
      const finalize = setTimeout(() => {
        setTsmDraft((d) => ({
          ...d,
          marketValue: SYNC_ROW.marketValue,
        }))
        setTsmFormulaTyping(target)
      }, 155 + target.length * TSM_CHAR_MS + 40)
      return () => {
        clearTimeout(unpress)
        timers.forEach(clearTimeout)
        clearTimeout(finalize)
      }
    }

    if (phase === "tsmType4") {
      setTyped(EDIT_TO.length)
      setPressed(true)
      const unpress = setTimeout(() => setPressed(false), 180)
      setTsmFormulaTyping("")
      const target = TSM_GL_FORMULA
      const timers: ReturnType<typeof setTimeout>[] = []
      for (let i = 1; i <= target.length; i++) {
        timers.push(
          setTimeout(() => {
            setTsmFormulaTyping(target.slice(0, i))
          }, 155 + i * TSM_CHAR_MS),
        )
      }
      const finalize = setTimeout(() => {
        setTsmDraft((d) => ({
          ...d,
          gainLoss: SYNC_ROW.gainLoss,
        }))
        setTsmFormulaTyping(target)
      }, 155 + target.length * TSM_CHAR_MS + 40)
      return () => {
        clearTimeout(unpress)
        timers.forEach(clearTimeout)
        clearTimeout(finalize)
      }
    }

    if (
      phase === "tsmMove0" ||
      phase === "tsmMove1" ||
      phase === "tsmMove2" ||
      phase === "tsmMove3" ||
      phase === "tsmMove4"
    ) {
      setTyped(EDIT_TO.length)
      if (phase === "tsmMove4") {
        setTsmFormulaTyping("")
      }
      return
    }

    if (phase === "holding") {
      setTyped(EDIT_TO.length)
      setTsmFormulaTyping("")
      setTsmDraft({ ...SYNC_ROW })
    }
  }, [active, phase])

  const isEditing = phase === "typing" || phase === "commit"

  const isSelected = phase === "select" || phase === "typing" || phase === "commit"

  const isTsmTyping = isTsmTypingPhase(phase)

  const editCommitted =
    phase === "commit" ||
    (phase.startsWith("tsm") && phase !== "resetting") ||
    phase === "holding"

  const editDisplay = isEditing ? EDIT_TO.slice(0, typed) : EDIT_FROM

  const baseRows = INITIAL_ROWS.map((row, i) => {
    if (i !== EDIT_CELL.row) return row
    if (!editCommitted) return row
    const impliedCost =
      parseUsd(row.marketValue) / (1 + parsePctSigned(row.gainLoss))
    const newMvNum = Number.parseFloat(EDIT_TO) * Number.parseInt(row.qty, 10)
    return {
      ...row,
      price: EDIT_TO,
      marketValue: formatUsdMv(EDIT_TO, row.qty),
      gainLoss: formatGainLossPct((newMvNum - impliedCost) / impliedCost),
    }
  })

  const syncRowVisible =
    phase === "tsmPrep" ||
    phase.startsWith("tsmMove") ||
    phase.startsWith("tsmType") ||
    phase === "holding"

  const rows = syncRowVisible ? [...baseRows, tsmDraft] : baseRows

  const tsmCol = tsmPhaseColumn(phase)

  let cellRef: string
  let formulaPrefix: string
  let formulaValue: string

  if (tsmShowsFormula(phase)) {
    const sheetRow = TSM_DATA_ROW_INDEX + 2
    const col =
      phase === "tsmPrep" ? 0 : tsmCol !== null ? tsmCol : 0
    cellRef = `${VISIBLE_COLS[col]}${sheetRow}`
    const movePhase =
      phase === "tsmMove0" ||
      phase === "tsmMove1" ||
      phase === "tsmMove2" ||
      phase === "tsmMove3" ||
      phase === "tsmMove4"

    if (isTsmFormulaTypingPhase(phase)) {
      formulaPrefix = ""
      formulaValue = tsmFormulaTyping
    } else {
      const draftVals = [
        tsmDraft.account,
        tsmDraft.price,
        tsmDraft.qty,
        tsmDraft.marketValue,
        tsmDraft.gainLoss,
      ] as const
      formulaPrefix = col === 1 ? "$" : ""
      formulaValue =
        phase === "tsmPrep" || movePhase ? "" : draftVals[col] ?? ""
    }
  } else {
    cellRef = `${VISIBLE_COLS[EDIT_CELL.col]}${EDIT_CELL.row + 2}`
    formulaPrefix = "$"
    formulaValue = isEditing ? editDisplay : EDIT_FROM
  }

  const showFormulaArea =
    isSelected || isEditing || tsmShowsFormula(phase)

  const cursorVisible =
    phase === "cursorMove" ||
    phase === "select" ||
    phase === "typing" ||
    phase === "commit" ||
    phase === "tsmPrep" ||
    phase.startsWith("tsmMove") ||
    phase.startsWith("tsmType")

  const cursor: SpreadsheetCursorPoint = (() => {
    if (phase === "cursorMove") return spreadsheetCursor.approach
    if (phase === "tsmPrep") return spreadsheetCursor.intelPrep
    if (tsmCol !== null) return spreadsheetCursor.tsmByCol[tsmCol]
    return spreadsheetCursor.cell
  })()

  let activeCol: number
  let activeRow: number

  if (tsmShowsCellChrome(phase) && tsmCol !== null) {
    activeCol = tsmCol
    activeRow = TSM_DATA_ROW_INDEX
  } else if (isSelected) {
    activeCol = EDIT_CELL.col
    activeRow = EDIT_CELL.row
  } else {
    activeCol = -1
    activeRow = -1
  }

  return {
    phase,
    pressed,
    isSelected,
    isEditing,
    isTsmTyping,
    commitFlash,
    syncRowVisible,
    tsmShowsSelectionChrome: tsmShowsCellChrome(phase),
    rows,
    cellRef,
    formulaPrefix,
    formulaValue,
    showFormulaArea,
    editDisplay,
    cursorVisible,
    cursor,
    activeCol,
    activeRow,
    tsmFocusCol: tsmCol,
  }
}
