"use client"

import { ChevronDown, Menu, Plus } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

import { Cursor } from "./cursor"
import {
  COLUMN_HEADERS,
  COMPACT_VISIBLE_COLS,
  DATA_COLUMN_COUNT,
  EDIT_CELL,
  GRID_METRICS_COMPACT,
  GRID_METRICS_DESKTOP,
  VISIBLE_COLS,
  VISIBLE_ROW_COUNT,
  type RowData,
} from "../lib/config"
import { useSpreadsheetAnimation } from "../hooks/use-spreadsheet-animation"

import "../styles/spreadsheet.css"

function cellValue(
  dataIdx: number,
  colIdx: number,
  rows: readonly RowData[],
  editDisplay: string,
  editingThisCell: boolean
): string {
  if (colIdx >= DATA_COLUMN_COUNT) return ""
  const row = rows[dataIdx]
  if (!row) return ""

  const values = [
    row.account,
    row.price,
    row.qty,
    row.marketValue,
    row.gainLoss,
  ] as const
  if (editingThisCell) return editDisplay
  return values[colIdx] ?? ""
}

export default function Spreadsheet({ className }: { className?: string }) {
  const isMobile = useIsMobile()
  const gridMetrics = isMobile ? GRID_METRICS_COMPACT : GRID_METRICS_DESKTOP
  const visibleCols = isMobile ? COMPACT_VISIBLE_COLS : VISIBLE_COLS

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
  } = useSpreadsheetAnimation(true, isMobile)

  const { rowNumRem, colLetterRowRem, dataRowRem } = gridMetrics
  const colTemplate = `${rowNumRem}rem repeat(${visibleCols.length}, minmax(0, 1fr))`
  const rowTemplate = `${colLetterRowRem}rem repeat(${VISIBLE_ROW_COUNT}, ${dataRowRem}rem)`
  const emptyRowCount = Math.max(0, VISIBLE_ROW_COUNT - 1 - rows.length)

  return (
    <div
      className={cn(
        "ss-root mx-auto w-full min-w-0 max-w-3xl overflow-hidden rounded-md border border-(--ss-border) bg-(--ss-shell-bg) font-[Arial,Roboto,'Helvetica_Neue',sans-serif] shadow-(--ss-shadow) md:max-w-4xl",
        isMobile && "ss-root--compact",
        className
      )}
    >
      <div className="flex h-7 shrink-0 items-stretch border-b border-(--ss-formula-border) bg-(--ss-formula-bg) md:h-9">
        <div className="ss-font-chrome flex w-12 shrink-0 items-center justify-center gap-0.5 border-r border-(--ss-formula-border) px-1 text-(--ss-name-box-fg) md:w-16 md:px-1.5">
          <span className="tabular-nums">
            {showFormulaArea ? cellRef : " \u00A0"}
          </span>
          <ChevronDown
            className="size-3.5 shrink-0 text-(--ss-cell-muted)"
            aria-hidden
          />
        </div>
        <div
          className="w-px shrink-0 bg-(--ss-formula-border)"
          aria-hidden
        />
        <span
          className="flex w-7 shrink-0 items-center justify-center font-serif text-xs text-(--ss-fx-fg) italic md:w-8 md:text-sm"
          aria-hidden
        >
          fx
        </span>
        <div className="ss-font-chrome flex min-w-0 flex-1 items-center truncate px-2 text-(--ss-cell-fg) md:px-2.5">
          {showFormulaArea ? (
            <>
              {`${formulaPrefix}${formulaValue}`}
              {isEditing || isTsmTyping ? (
                <span
                  className="ss-caret ml-px inline-block h-[0.9em] w-px translate-y-px bg-(--ss-caret) align-text-bottom"
                  aria-hidden
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="bg-(--ss-grid-bg)">
        <div className="ss-grid-body relative overflow-hidden [&::-webkit-scrollbar]:hidden">
          <div
            className="ss-grid grid w-full"
            style={{
              gridTemplateColumns: colTemplate,
              gridTemplateRows: rowTemplate,
            }}
          >
            <div
              className="border-r border-b border-(--ss-grid-line) bg-(--ss-header-bg)"
              aria-hidden
            />

            {visibleCols.map((letter, colIdx) => (
              <div
                key={letter}
                className={cn(
                  "ss-font-chrome flex items-center justify-center border-r border-b border-(--ss-grid-line) bg-(--ss-header-bg) text-(--ss-header-fg) select-none",
                  activeCol === colIdx &&
                    "bg-(--ss-header-active) text-(--ss-name-box-fg)"
                )}
              >
                {letter}
              </div>
            ))}

            <div className="contents">
              <div className="ss-font-chrome flex items-center justify-center border-r border-b border-(--ss-grid-line) bg-(--ss-header-bg) text-(--ss-header-fg) select-none">
                1
              </div>
              {visibleCols.map((letter, colIdx) => (
                <div
                  key={`hdr-${letter}`}
                  className={cn(
                    "ss-cell-inner flex h-full items-center border-r border-b border-(--ss-grid-line) bg-(--ss-header-bg) px-1.5 font-semibold text-(--ss-name-box-fg)",
                    colIdx < DATA_COLUMN_COUNT
                      ? "ss-font-col-hdr whitespace-nowrap"
                      : "ss-font-chrome overflow-hidden",
                    (colIdx === 1 ||
                      colIdx === 2 ||
                      colIdx === 3 ||
                      colIdx === 4) &&
                      "justify-end tabular-nums"
                  )}
                >
                  {COLUMN_HEADERS[colIdx] ?? ""}
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
                      "ss-font-chrome flex items-center justify-center border-r border-b border-(--ss-grid-line) bg-(--ss-header-bg) text-(--ss-header-fg) select-none",
                      activeRow === dataIdx &&
                        "bg-(--ss-header-active) text-(--ss-name-box-fg)"
                    )}
                  >
                    {sheetRow}
                  </div>

                  {visibleCols.map((letter, colIdx) => {
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
                      editingThisCell
                    )
                    const display =
                      raw && (colIdx === 1 || colIdx === 3) ? `$${raw}` : raw

                    return (
                      <div
                        key={`${row.id}-${letter}`}
                        className={cn(
                          "relative h-full min-h-0 min-w-0",
                          selected && commitFlash && "ss-cell--commit-flash"
                        )}
                      >
                        <div
                          className={cn(
                            "ss-cell-inner flex h-full items-center border-r border-b border-(--ss-grid-line) bg-(--ss-grid-bg) px-1.5 text-(--ss-cell-fg)",
                            colIdx < DATA_COLUMN_COUNT
                              ? "ss-font-data whitespace-nowrap"
                              : "ss-font-chrome overflow-hidden",
                            (colIdx === 1 ||
                              colIdx === 2 ||
                              colIdx === 3 ||
                              colIdx === 4) &&
                              "justify-end tabular-nums",
                            colIdx === 4 &&
                              raw.startsWith("+") &&
                              "text-green-600 dark:text-green-400",
                            colIdx === 4 &&
                              raw.startsWith("-") &&
                              "text-red-600 dark:text-red-400"
                          )}
                        >
                          {display}
                        </div>
                        {selected ? (
                          <>
                            <div
                              className="pointer-events-none absolute inset-0 z-2 -m-px border-2 border-(--ss-selection)"
                              aria-hidden
                            />
                            <div
                              className="pointer-events-none absolute -right-1.5 -bottom-1.5 z-3 size-2 border border-(--ss-selection-fill) bg-(--ss-selection)"
                              aria-hidden
                            />
                          </>
                        ) : null}
                        {isTsmSelectedCell ? (
                          <>
                            <div
                              className="pointer-events-none absolute inset-0 z-2 -m-px border-2 border-(--ss-selection)"
                              aria-hidden
                            />
                            <div
                              className="pointer-events-none absolute -right-1.5 -bottom-1.5 z-3 size-2 border border-(--ss-selection-fill) bg-(--ss-selection)"
                              aria-hidden
                            />
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
                  <div className="ss-font-chrome flex items-center justify-center border-r border-b border-(--ss-grid-line) bg-(--ss-header-bg) text-(--ss-header-fg) select-none">
                    {sheetRow}
                  </div>
                  {visibleCols.map((letter, colIdx) => (
                    <div
                      key={`${sheetRow}-${letter}`}
                      className={cn(
                        "ss-cell-inner flex h-full items-center border-r border-b border-(--ss-grid-line) bg-(--ss-grid-bg) px-1.5 text-(--ss-cell-fg)",
                        colIdx < DATA_COLUMN_COUNT
                          ? "ss-font-data"
                          : "ss-font-chrome overflow-hidden"
                      )}
                    />
                  ))}
                </div>
              )
            })}
          </div>

          {cursorVisible ? (
            <Cursor
              x={cursor.x}
              y={cursor.y}
              pressed={pressed}
              yNudgeRem={cursor.yNudgeRem ?? 0}
              rowHeightRem={dataRowRem}
            />
          ) : null}
        </div>
      </div>

      <div
        className="flex h-7 shrink-0 items-center gap-1 border-t border-(--ss-sheet-bar-border) bg-(--ss-sheet-bar-bg) px-1 md:h-9 md:px-1.5"
        role="toolbar"
        aria-label="Sheet tabs"
      >
        <button
          type="button"
          className="flex size-7 shrink-0 cursor-default items-center justify-center rounded-[2px] border-none bg-transparent text-(--ss-sheet-bar-icon)"
          aria-label="Add sheet"
        >
          <Plus className="size-4" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="flex size-7 shrink-0 cursor-default items-center justify-center rounded-[2px] border-none bg-transparent text-(--ss-sheet-bar-icon)"
          aria-label="All sheets"
        >
          <Menu className="size-4" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="ss-font-tab flex h-7 cursor-default items-center gap-1 rounded-t-[2px] rounded-b-none border-none bg-(--ss-sheet-tab-bg) py-0 pr-2.5 pl-3 font-semibold whitespace-nowrap text-(--ss-sheet-tab-fg)"
          aria-current="page"
        >
          <span>Positions</span>
          <ChevronDown
            className="size-3.5 shrink-0 text-(--ss-sheet-tab-fg)"
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}
