import { differenceInCalendarDays } from "date-fns"

export const WORDLE_DEFAULT_TIME_ZONE = "UTC"
export const WORDLE_DAILY_EPOCH = new Date(Date.UTC(2021, 5, 19))

type TimeZoneDayParts = { year: number; month: number; day: number }

function getDayPartsInTimeZone(
  date: Date,
  timeZone: string = WORDLE_DEFAULT_TIME_ZONE
): TimeZoneDayParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const parts = formatter.formatToParts(date)
  const year = Number(parts.find((p) => p.type === "year")?.value ?? NaN)
  const month = Number(parts.find((p) => p.type === "month")?.value ?? NaN)
  const day = Number(parts.find((p) => p.type === "day")?.value ?? NaN)
  return { year, month, day }
}

export function normalizeWordleTimeZone(timeZone?: string): string {
  const tz = (timeZone ?? "").trim()
  if (!tz) return WORDLE_DEFAULT_TIME_ZONE
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date())
    return tz
  } catch {
    return WORDLE_DEFAULT_TIME_ZONE
  }
}

function dayStartFromParts(parts: TimeZoneDayParts): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

export function dayStartInTimeZone(date = new Date(), timeZone?: string): Date {
  const tz = normalizeWordleTimeZone(timeZone)
  return dayStartFromParts(getDayPartsInTimeZone(date, tz))
}

export function dailyPuzzleNumberForTimeZone(date = new Date(), timeZone?: string): number {
  return differenceInCalendarDays(dayStartInTimeZone(date, timeZone), WORDLE_DAILY_EPOCH) + 1
}

export function dayKeyForTimeZone(date = new Date(), timeZone?: string): string {
  const tz = normalizeWordleTimeZone(timeZone)
  const parts = getDayPartsInTimeZone(date, tz)
  const mo = String(parts.month).padStart(2, "0")
  const da = String(parts.day).padStart(2, "0")
  return `${parts.year}-${mo}-${da}`
}
