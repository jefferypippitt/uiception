import { describe, expect, it } from "vitest"

import {
  activeUnitKeys,
  BOARD_COLS,
  boardNaturalSize,
  centerIn,
  firstGapIndex,
  fitBoardFrame,
  fitBoardScale,
  layoutBoard,
  padBoard,
  placeAtAxis,
  TARGET_CELL_PX,
  unitValue,
  wrapBalanced,
  wrapToRows,
} from "@/registry/new-york/templates/landing-page-v3/lib/board"
import type { BoardSite } from "@/registry/new-york/templates/landing-page-v3/lib/board"
import type { CountdownParts } from "@/registry/new-york/templates/landing-page-v3/lib/countdown"
import { site } from "@/registry/new-york/templates/landing-page-v3/lib/site"

const acme: BoardSite = {
  headline: "Countdown until",
  name: "Acme 2.0",
  units: ["Days", "Hours", "Minutes", "Seconds"],
}

const parts: CountdownParts = {
  days: 288,
  hours: 9,
  minutes: 30,
  seconds: 12,
}

function copyRows(rows: string[]): string[] {
  return rows.filter((row) => [...row].some((ch) => ch !== " "))
}

describe("wrapToRows / wrapBalanced", () => {
  it("breaks a headline that does not fit the content column", () => {
    expect(wrapToRows("Countdown until", 12)).toEqual(["COUNTDOWN", "UNTIL"])
  })

  it("keeps a short name on one line", () => {
    expect(wrapBalanced("Acme 2.0", 12)).toEqual(["ACME 2.0"])
  })

  it("wraps an arbitrary title at word boundaries", () => {
    expect(wrapToRows("The future of design systems", 12)).toEqual([
      "THE FUTURE",
      "OF DESIGN",
      "SYSTEMS",
    ])
  })
})

describe("centerIn", () => {
  it("puts leftover pad on the right so odd-width lines share a column", () => {
    expect(centerIn("ACME", 14)).toBe("     ACME     ")
    expect(centerIn("UNTIL", 14)).toBe("    UNTIL     ")
  })
})

describe("placeAtAxis", () => {
  it("right-aligns the left token, leaves the axis empty, left-aligns the right token", () => {
    expect(placeAtAxis("ACME", "2.0", 23, 12)).toBe("        ACME 2.0       ")
    expect(placeAtAxis("288", "DAYS", 23, 12)).toBe("         288 DAYS      ")
  })
})

describe("layoutBoard", () => {
  it("locks the board at BOARD_COLS modules", () => {
    const { cols, rows } = layoutBoard(acme, parts)
    expect(cols).toBe(BOARD_COLS)
    expect(BOARD_COLS).toBe(23)
    expect(rows).toHaveLength(10)
    expect(rows.every((row) => row.length === cols)).toBe(true)
  })

  it("hangs ACME 2.0 off the title gap", () => {
    const { rows } = layoutBoard(acme, parts)
    const copy = copyRows(rows)

    expect(copy[0]).toBe("  COUNTDOWN UNTIL      ")
    expect(copy[1]).toBe("       ACME 2.0        ")
    expect(rows[2]).toBe(" ".repeat(BOARD_COLS))
    expect(rows[3]).toBe(copy[1])

    const axis = firstGapIndex(copy[0]!)
    expect(copy[0]![axis]).toBe(" ")
    expect(copy[1]![axis]).toBe(" ")
    expect(copy[0]![axis - 1]).toBe("N")
    expect(copy[0]![axis + 1]).toBe("U")
    expect(copy[0]![7]).toBe("D")
    expect(copy[1]![7]).toBe("A")
    expect(copy[1]![axis + 1]).toBe("2")
  })

  it("puts each countdown unit on its own row as number, empty flap, label", () => {
    const { rows } = layoutBoard(site, parts)
    const copy = copyRows(rows)
    const units = copy.slice(2)
    const axis = firstGapIndex(copy[0]!)

    expect(units).toEqual([
      "        288 DAYS       ",
      "         09 HOURS      ",
      "         30 MINUTES    ",
      "         12 SECONDS    ",
    ])

    for (const row of units) {
      expect(row[axis]).toBe(" ")
      expect(row[axis + 1]).toMatch(/[A-Z]/)
      expect(row[axis - 1]).toMatch(/\d/)
    }
  })

  it("leaves wrap leftover empty instead of filling it with a flap", () => {
    const { rows, cols } = layoutBoard(
      {
        headline: "The future of design systems for everyone",
        name: "Northwind Labs",
        units: acme.units,
      },
      parts
    )

    expect(cols).toBe(BOARD_COLS)
    const copy = copyRows(rows)
    const units = copy.slice(-4)
    const name = copy[copy.length - 5]!
    expect(units).toHaveLength(4)
    expect(copy.length).toBeGreaterThan(6)

    const axis = firstGapIndex(copy[0]!)
    for (const row of [name, ...units]) {
      expect(row.length).toBe(cols)
      expect(row).not.toContain("\u00a0")
      expect(row[axis]).toBe(" ")
    }
    for (const row of copy) {
      expect(row).not.toContain("\u00a0")
    }
  })

  it("does not resize when days drop from three digits to two", () => {
    const wide = layoutBoard(acme, parts)
    const narrow = layoutBoard(acme, { ...parts, days: 99 })
    expect(narrow.cols).toBe(wide.cols)
    expect(narrow.cols).toBe(BOARD_COLS)

    const axis = firstGapIndex(copyRows(wide.rows)[0]!)
    const wideDays = copyRows(wide.rows)[2]!
    const narrowDays = copyRows(narrow.rows)[2]!
    expect(wideDays.indexOf("DAYS")).toBe(axis + 1)
    expect(narrowDays.indexOf("DAYS")).toBe(axis + 1)
  })
})

describe("activeUnitKeys", () => {
  it("keeps every unit once days are nonzero", () => {
    expect(activeUnitKeys(parts)).toEqual(["days", "hours", "minutes", "seconds"])
  })

  it("trims days once they hit zero for good", () => {
    expect(activeUnitKeys({ days: 0, hours: 9, minutes: 30, seconds: 12 })).toEqual([
      "hours",
      "minutes",
      "seconds",
    ])
  })

  it("trims down to minutes and seconds when days and hours are both zero", () => {
    expect(
      activeUnitKeys({ days: 0, hours: 0, minutes: 30, seconds: 12 })
    ).toEqual(["minutes", "seconds"])
  })

  it("always keeps seconds, even when the countdown is fully spent", () => {
    expect(activeUnitKeys({ days: 0, hours: 0, minutes: 0, seconds: 0 })).toEqual([
      "seconds",
    ])
  })

  it("trims a mid-sequence zero so no row ever reads 0 (e.g. 0 hours with days left)", () => {
    expect(
      activeUnitKeys({ days: 123, hours: 0, minutes: 52, seconds: 9 })
    ).toEqual(["days", "minutes", "seconds"])
  })

  it("trims a zero minutes row while hours are still running", () => {
    expect(
      activeUnitKeys({ days: 0, hours: 5, minutes: 0, seconds: 41 })
    ).toEqual(["hours", "seconds"])
  })

  it("keeps seconds through their zero so the bottom row never strobes", () => {
    expect(
      activeUnitKeys({ days: 2, hours: 4, minutes: 6, seconds: 0 })
    ).toEqual(["days", "hours", "minutes", "seconds"])
  })
})

describe("layoutBoard unit row options", () => {
  function unitSlotRows(layout: ReturnType<typeof layoutBoard>) {
    const start = layout.rowIds.findIndex((id) => id.startsWith("unit-"))
    return {
      start,
      rows: layout.rows.slice(start, start + 4),
      ids: layout.rowIds.slice(start, start + 4),
    }
  }

  it("keeps four unit slots when days trim — hours lands in the original days row", () => {
    const full = layoutBoard(acme, parts)
    const trimmed = layoutBoard(acme, {
      days: 0,
      hours: 9,
      minutes: 30,
      seconds: 12,
    })

    expect(full.rows).toHaveLength(trimmed.rows.length)

    const fullUnits = unitSlotRows(full)
    const trimmedUnits = unitSlotRows(trimmed)

    expect(fullUnits.start).toBe(trimmedUnits.start)
    expect(fullUnits.ids).toEqual([
      "unit-slot-0",
      "unit-slot-1",
      "unit-slot-2",
      "unit-slot-3",
    ])
    expect(trimmedUnits.ids).toEqual(fullUnits.ids)

    expect(copyRows(trimmedUnits.rows)).toEqual([
      "         09 HOURS      ",
      "         30 MINUTES    ",
      "         12 SECONDS    ",
    ])
    expect(trimmedUnits.rows[3]).toBe(" ".repeat(BOARD_COLS))
    // Hours occupies the same absolute row index Days used before.
    expect(trimmed.rows[fullUnits.start]).toContain("HOURS")
  })

  it("places seconds in the original days row once only seconds remain", () => {
    const full = layoutBoard(acme, parts)
    const spent = layoutBoard(acme, {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 7,
    })

    const fullUnits = unitSlotRows(full)
    const spentUnits = unitSlotRows(spent)

    expect(spent.rows).toHaveLength(full.rows.length)
    expect(spentUnits.start).toBe(fullUnits.start)
    expect(spentUnits.ids).toEqual(fullUnits.ids)
    expect(spent.rows[fullUnits.start]).toContain("SECONDS")
    expect(spent.rows[fullUnits.start]).toContain("07")
    expect(spentUnits.rows.slice(1).every((row) => row.trim() === "")).toBe(true)
  })

  it("keeps physical slot rowIds stable across a trim", () => {
    const full = layoutBoard(acme, parts)
    const trimmed = layoutBoard(acme, {
      days: 0,
      hours: 9,
      minutes: 30,
      seconds: 12,
    })

    expect(unitSlotRows(trimmed).ids).toEqual(unitSlotRows(full).ids)
  })

  it("lets a caller force which unit rows render, e.g. mid scramble-out", () => {
    const { rows, rowIds } = layoutBoard(
      acme,
      { days: 0, hours: 9, minutes: 30, seconds: 12 },
      BOARD_COLS,
      {
        unitKeys: ["days", "hours", "minutes", "seconds"],
        unitOverrides: { days: { left: "X", right: "DAYS" } },
      }
    )
    const start = rowIds.findIndex((id) => id === "unit-slot-0")
    const units = rows.slice(start, start + 4)
    expect(units[0]).toContain("X")
    expect(units[0]).toContain("DAYS")
    expect(units.slice(1)).toEqual([
      "         09 HOURS      ",
      "         30 MINUTES    ",
      "         12 SECONDS    ",
    ])
  })
})

describe("unitValue", () => {
  it("pads the sub-day units to two digits but leaves days natural width", () => {
    expect(unitValue("days", { days: 7, hours: 0, minutes: 0, seconds: 0 })).toBe("7")
    expect(unitValue("hours", { days: 0, hours: 7, minutes: 0, seconds: 0 })).toBe("07")
    expect(unitValue("minutes", { days: 0, hours: 0, minutes: 7, seconds: 0 })).toBe("07")
    expect(unitValue("seconds", { days: 0, hours: 0, minutes: 0, seconds: 7 })).toBe("07")
  })

})

describe("layoutBoard zero trim", () => {
  it("skips the hours row entirely rather than rendering 00 HOURS", () => {
    const { rows, rowIds } = layoutBoard(acme, {
      days: 123,
      hours: 0,
      minutes: 32,
      seconds: 10,
    })

    expect(rows.join("\n")).not.toContain("HOURS")

    const start = rowIds.findIndex((id) => id.startsWith("unit-"))
    expect(rowIds.slice(start, start + 4)).toEqual([
      "unit-slot-0",
      "unit-slot-1",
      "unit-slot-2",
      "unit-slot-3",
    ])
    // Minutes takes the slot hours vacated, directly under days.
    expect(rows[start + 1]).toContain("MINUTES")
  })

  it("never prints a zero value for days, hours, or minutes", () => {
    const cases: CountdownParts[] = [
      { days: 123, hours: 0, minutes: 32, seconds: 10 },
      { days: 0, hours: 5, minutes: 0, seconds: 41 },
      { days: 0, hours: 0, minutes: 12, seconds: 3 },
      { days: 9, hours: 0, minutes: 0, seconds: 0 },
    ]

    for (const part of cases) {
      const { rows } = layoutBoard(acme, part)
      for (const label of ["DAYS", "HOURS", "MINUTES"]) {
        const row = rows.find((r) => r.includes(label))
        if (!row) continue
        // Padding means "05" is fine; a rendered value of zero is not.
        const value = row.trim().split(/\s+/)[0]!
        expect(Number(value)).not.toBe(0)
      }
    }
  })
})

describe("padBoard / fitBoardFrame", () => {
  it("frames copy in empty flaps without changing the content", () => {
    const inner = layoutBoard(acme, parts)
    const framed = padBoard(inner, 31, 16)

    expect(framed.cols).toBe(31)
    expect(framed.rows).toHaveLength(16)
    expect(framed.rowIds).toHaveLength(16)
    expect(framed.rows.every((row) => row.length === 31)).toBe(true)
    expect(framed.rowIds).toContain("unit-slot-0")
    expect(framed.rowIds.some((id) => id.startsWith("pad-top-"))).toBe(true)

    const copy = copyRows(framed.rows)
    expect(copy[0]).toContain("COUNTDOWN UNTIL")
    expect(copy[1]).toContain("ACME 2.0")
    expect(firstGapIndex(copy[0]!) - firstGapIndex(inner.rows[1]!)).toBe(
      Math.floor((31 - inner.cols) / 2)
    )
  })

  it("does not shrink below the content grid", () => {
    const inner = layoutBoard(acme, parts)
    const framed = padBoard(inner, 10, 4)
    expect(framed.cols).toBe(inner.cols)
    expect(framed.rows).toHaveLength(inner.rows.length)
    expect(framed.rowIds).toEqual(inner.rowIds)
  })

  it("adds columns to fill a wide frame at the target module size", () => {
    const fit = fitBoardFrame(1440, 900, 23, 10, 8)
    expect(fit.cols).toBeGreaterThan(23)
    expect(fit.rows).toBeGreaterThan(10)
  })

  it("does not tile extra flaps when the frame is narrower than the content grid", () => {
    const fit = fitBoardFrame(390, 680, 23, 12, 4.8)
    expect(fit.cols).toBe(23)
    expect(fit.rows).toBe(12)
  })

  it("scales the content grid down to fit a narrow frame", () => {
    const gap = 4.8
    const natural = boardNaturalSize(23, 12, gap)
    expect(natural.width).toBe(23 * TARGET_CELL_PX + 22 * gap)
    expect(fitBoardScale(390, 680, 23, 12, gap)).toBeLessThan(1)
    expect(fitBoardScale(1440, 900, 23, 12, gap)).toBe(1)
  })
})
