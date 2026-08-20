import { describe, expect, it } from "vitest"

import {
  padDigits,
  remainingParts,
} from "@/registry/new-york/templates/landing-page-v3/lib/countdown"

describe("remainingParts", () => {
  it("computes an exact boundary of days, hours, minutes, and seconds", () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const target = new Date("2026-01-03T03:04:05.000Z")

    expect(remainingParts(target, now)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
    })
  })

  it("stays under a day at 23h 59m 59s remaining", () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const target = new Date("2026-01-01T23:59:59.000Z")

    expect(remainingParts(target, now)).toEqual({
      days: 0,
      hours: 23,
      minutes: 59,
      seconds: 59,
    })
  })

  it("rolls over to a full day at exactly 24 hours remaining", () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const target = new Date("2026-01-02T00:00:00.000Z")

    expect(remainingParts(target, now)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  })

  it("returns all zeros when target equals now", () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const target = new Date("2026-01-01T00:00:00.000Z")

    expect(remainingParts(target, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  })

  it("clamps to all zeros when the target is in the past", () => {
    const now = new Date("2026-01-05T00:00:00.000Z")
    const target = new Date("2026-01-01T00:00:00.000Z")

    expect(remainingParts(target, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  })

  it("parses a string target the same as an equivalent Date object", () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const targetDate = new Date("2026-01-03T03:04:05.000Z")
    const targetString = "2026-01-03T03:04:05.000Z"

    expect(remainingParts(targetString, now)).toEqual(
      remainingParts(targetDate, now)
    )
  })
})

describe("padDigits", () => {
  it("pads a single digit to width 2 by default", () => {
    expect(padDigits(5)).toBe("05")
  })

  it("does not truncate a value already at the target width", () => {
    expect(padDigits(42)).toBe("42")
  })

  it("pads to a custom width", () => {
    expect(padDigits(5, 3)).toBe("005")
  })

  it("clamps a negative value to zero", () => {
    expect(padDigits(-3)).toBe("00")
  })
})
