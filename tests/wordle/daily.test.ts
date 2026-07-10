import { describe, expect, it } from "vitest"
import {
  dailyPuzzleNumberForTimeZone,
  dayKeyForTimeZone,
  nextDailyPuzzleBoundaryUtcMs,
  normalizeWordleTimeZone,
  WORDLE_DAILY_EPOCH_DATE,
} from "@/lib/wordle/daily"

describe("normalizeWordleTimeZone", () => {
  it("returns a valid IANA zone unchanged", () => {
    expect(normalizeWordleTimeZone("America/New_York")).toBe("America/New_York")
  })

  it("falls back to UTC for an invalid zone", () => {
    expect(normalizeWordleTimeZone("Not/AZone")).toBe("UTC")
  })

  it("falls back to UTC for empty/undefined input", () => {
    expect(normalizeWordleTimeZone(undefined)).toBe("UTC")
    expect(normalizeWordleTimeZone("  ")).toBe("UTC")
  })
})

describe("dayKeyForTimeZone", () => {
  it("returns the UTC calendar date for a UTC instant", () => {
    const date = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    expect(dayKeyForTimeZone(date, "UTC")).toBe("2024-01-15")
  })

  it("returns a different calendar date in a timezone behind UTC, across midnight", () => {
    // 2024-01-16T02:00:00Z is 2024-01-15T21:00:00 in America/New_York (EST, UTC-5, no DST in January)
    const date = new Date(Date.UTC(2024, 0, 16, 2, 0, 0))
    expect(dayKeyForTimeZone(date, "America/New_York")).toBe("2024-01-15")
    expect(dayKeyForTimeZone(date, "UTC")).toBe("2024-01-16")
  })
})

describe("dailyPuzzleNumberForTimeZone", () => {
  it("returns puzzle #1 on the epoch date itself", () => {
    expect(dailyPuzzleNumberForTimeZone(WORDLE_DAILY_EPOCH_DATE, "UTC")).toBe(1)
  })

  it("increments by exactly 1 the following day", () => {
    const nextDay = new Date(WORDLE_DAILY_EPOCH_DATE.getTime() + 86_400_000)
    expect(dailyPuzzleNumberForTimeZone(nextDay, "UTC")).toBe(2)
  })
})

describe("nextDailyPuzzleBoundaryUtcMs", () => {
  it("returns exact UTC midnight of the next day when timeZone is UTC", () => {
    const date = new Date(Date.UTC(2024, 0, 15, 10, 0, 0))
    expect(nextDailyPuzzleBoundaryUtcMs(date, "UTC")).toBe(Date.UTC(2024, 0, 16))
  })

  it("returns the correct UTC instant for a non-UTC timezone's midnight rollover", () => {
    // 2024-01-15T10:00:00Z is 2024-01-15T05:00:00 in America/New_York (EST).
    // The next New York midnight (2024-01-16T00:00:00-05:00) is 2024-01-16T05:00:00Z.
    const date = new Date(Date.UTC(2024, 0, 15, 10, 0, 0))
    expect(nextDailyPuzzleBoundaryUtcMs(date, "America/New_York")).toBe(
      Date.UTC(2024, 0, 16, 5, 0, 0)
    )
  })
})
