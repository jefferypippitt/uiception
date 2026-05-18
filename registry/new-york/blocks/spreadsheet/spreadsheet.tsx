"use client"

import { ChevronDown, Menu, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

import { Cursor } from "./components/cursor"
import {
  COLUMN_HEADERS,
  DATA_COLUMN_COUNT,
  EDIT_CELL,
  VISIBLE_COLS,
  VISIBLE_ROW_COUNT,
  type RowData,
} from "./lib/config"
import { useSpreadsheetAnimation } from "./hooks/use-spreadsheet-animation"

import "./styles/spreadsheet.css"

function cellValue(
  dataIdx: number,
  colIdx: number,
  rows: readonly RowData[],
  editDisplay: string,
  editingThisCell: boolean,
): string {
  if (colIdx >= DATA_COLUMN_COUNT) return ""
  const row = rows[dataIdx]
  if (!row) return ""

  const values = [
    row.account,
    row.arr,
    row.growth,
    row.marketValue,
    row.gainLoss,
  ] as const
  if (editingThisCell) return editDisplay
  return values[colIdx] ?? ""
}

export default function Spreadsheet({ className }: { className?: string }) {
  const {
    pressed,
    isSelected,
    isEditing,
    isTsmTyping,
    tsmShowsSelectionChrome,
    tsmFocusCol,
    commitFlash,
    syncRowVisible,
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
  } = useSpreadsheetAnimation()

  const colTemplate = `1.75rem repeat(${VISIBLE_COLS.length}, minmax(0, 1fr))`
  const rowTemplate = `1.5rem repeat(${VISIBLE_ROW_COUNT}, 1.375rem)`
  const emptyRowCount = Math.max(0, VISIBLE_ROW_COUNT - 1 - rows.length)

  return (
    <div
      className={cn(
        "ss-root ss-shell mx-auto w-full min-w-0 max-w-3xl overflow-hidden rounded-md",
        className,
      )}
    >
      <div className="ss-formula">
        <div className="ss-name-box">
          <span className="tabular-nums">
            {showFormulaArea ? cellRef : " "}
          </span>
          <ChevronDown className="ss-name-box-chevron size-3 shrink-0" aria-hidden />
        </div>
        <div className="ss-formula-sep" aria-hidden />
        <span className="ss-fx" aria-hidden>
          fx
        </span>
        <div className="ss-formula-input">
          {showFormulaArea ? (
            <>
              {`${formulaPrefix}${formulaValue}`}
              {isEditing || isTsmTyping ? (
                <span className="ss-caret" aria-hidden />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="ss-grid-wrap">
        <div className="ss-grid-body">
          <div
            className="ss-grid"
            style={{
              gridTemplateColumns: colTemplate,
              gridTemplateRows: rowTemplate,
            }}
          >
            <div className="ss-corner" aria-hidden />

            {VISIBLE_COLS.map((letter, colIdx) => (
              <div
                key={letter}
                className={cn(
                  "ss-col-header",
                  activeCol === colIdx && "ss-col-header--active",
                )}
              >
                {letter}
              </div>
            ))}

            <div className="contents">
              <div className="ss-row-num">1</div>
              {VISIBLE_COLS.map((letter, colIdx) => (
                <div
                  key={`hdr-${letter}`}
                  className={cn(
                    "ss-cell ss-cell--header",
                    (colIdx === 1 ||
                      colIdx === 2 ||
                      colIdx === 3 ||
                      colIdx === 4) &&
                      "ss-cell--num",
                  )}
                >
                  <span className="truncate">{COLUMN_HEADERS[colIdx] ?? ""}</span>
                </div>
              ))}
            </div>

            {rows.map((row, dataIdx) => {
              const sheetRow = dataIdx + 2
              const isSyncRow = syncRowVisible && row.id === "r4"

              return (
                <div key={row.id} className="contents">
                  <div
                    className={cn(
                      "ss-row-num",
                      activeRow === dataIdx && "ss-row-num--active",
                    )}
                  >
                    {sheetRow}
                  </div>

                  {VISIBLE_COLS.map((letter, colIdx) => {
                    const selected =
                      isSelected &&
                      dataIdx === EDIT_CELL.row &&
                      colIdx === EDIT_CELL.col
                    const editingThisCell = Boolean(isEditing && selected)
                    const isTsmSelectedCell =
                      tsmShowsSelectionChrome &&
                      isSyncRow &&
                      tsmFocusCol !== null &&
                      colIdx === tsmFocusCol
                    const raw = cellValue(
                      dataIdx,
                      colIdx,
                      rows,
                      editDisplay,
                      editingThisCell,
                    )
                    const display =
                      raw &&
                      (colIdx === 1 || colIdx === 3)
                        ? `$${raw}`
                        : raw

                    return (
                      <div
                        key={`${row.id}-${letter}`}
                        className={cn(
                          "ss-cell-wrap",
                          selected && commitFlash && "ss-cell--commit-flash",
                        )}
                      >
                        <div
                          className={cn(
                            "ss-cell",
                            (colIdx === 1 ||
                              colIdx === 2 ||
                              colIdx === 3 ||
                              colIdx === 4) &&
                              "ss-cell--num",
                            colIdx === 4 &&
                              raw.startsWith("+") &&
                              "ss-cell--pnl-pos",
                            colIdx === 4 &&
                              raw.startsWith("-") &&
                              "ss-cell--pnl-neg",
                          )}
                        >
                          <span className="truncate">{display}</span>
                        </div>
                        {selected ? (
                          <>
                            <div className="ss-active-border" aria-hidden />
                            <div className="ss-fill-handle" aria-hidden />
                          </>
                        ) : null}
                        {isTsmSelectedCell ? (
                          <>
                            <div className="ss-active-border" aria-hidden />
                            <div className="ss-fill-handle" aria-hidden />
                          </>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {Array.from({ length: emptyRowCount }, (_, i) => {
              const sheetRow = rows.length + 2 + i
              return (
                <div key={`empty-${sheetRow}`} className="contents">
                  <div className="ss-row-num">{sheetRow}</div>
                  {VISIBLE_COLS.map((letter) => (
                    <div key={`${sheetRow}-${letter}`} className="ss-cell" />
                  ))}
                </div>
              )
            })}
          </div>

          {cursorVisible ? (
            <Cursor x={cursor.x} y={cursor.y} pressed={pressed} />
          ) : null}
        </div>
      </div>

      <div className="ss-sheet-bar" role="toolbar" aria-label="Sheet tabs">
        <button type="button" className="ss-sheet-bar-btn" aria-label="Add sheet">
          <Plus className="size-3.5" strokeWidth={2} aria-hidden />
        </button>
        <button type="button" className="ss-sheet-bar-btn" aria-label="All sheets">
          <Menu className="size-3.5" strokeWidth={2} aria-hidden />
        </button>
        <button type="button" className="ss-sheet-tab" aria-current="page">
          <span>Positions</span>
          <ChevronDown className="ss-sheet-tab-chevron size-3 shrink-0" aria-hidden />
        </button>
      </div>
    </div>
  )
}
