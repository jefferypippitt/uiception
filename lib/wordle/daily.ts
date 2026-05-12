const DAY_MS = 86_400_000

// Local puzzle days come from the visitor's IANA time zone. UTC is only the
// fallback when no valid zone is available and the neutral form for date math.
export const WORDLE_FALLBACK_TIME_ZONE = "UTC"
export const WORDLE_DAILY_EPOCH_DATE = new Date(Date.UTC(2021, 5, 19))

type CalendarDateParts = { year: number; month: number; day: number }

function compareCalendarDate(
  a: CalendarDateParts,
  b: CalendarDateParts
): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  return a.day - b.day
}

function addCalendarDays(
  parts: CalendarDateParts,
  days: number
): CalendarDateParts {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days))
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

function calendarDateInTimeZone(
  date: Date,
  timeZone: string = WORDLE_FALLBACK_TIME_ZONE
): CalendarDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const parts = formatter.formatToParts(date)
  return {
    year: Number(parts.find((part) => part.type === "year")?.value ?? NaN),
    month: Number(parts.find((part) => part.type === "month")?.value ?? NaN),
    day: Number(parts.find((part) => part.type === "day")?.value ?? NaN),
  }
}

function utcDateFromCalendarParts(parts: CalendarDateParts): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

function startOfCalendarDayUtcMs(
  parts: CalendarDateParts,
  timeZone: string
): number {
  const target = parts
  let before = Date.UTC(parts.year, parts.month - 1, parts.day - 1)
  let after = Date.UTC(parts.year, parts.month - 1, parts.day + 1)

  while (
    compareCalendarDate(
      calendarDateInTimeZone(new Date(before), timeZone),
      target
    ) >= 0
  ) {
    before -= DAY_MS
  }
  while (
    compareCalendarDate(
      calendarDateInTimeZone(new Date(after), timeZone),
      target
    ) < 0
  ) {
    after += DAY_MS
  }

  while (after - before > 1) {
    const midpoint = Math.floor((before + after) / 2)
    if (
      compareCalendarDate(
        calendarDateInTimeZone(new Date(midpoint), timeZone),
        target
      ) < 0
    ) {
      before = midpoint
    } else {
      after = midpoint
    }
  }

  return after
}

export function normalizeWordleTimeZone(timeZone?: string): string {
  const trimmed = (timeZone ?? "").trim()
  if (!trimmed) return WORDLE_FALLBACK_TIME_ZONE

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(new Date())
    return trimmed
  } catch {
    return WORDLE_FALLBACK_TIME_ZONE
  }
}

export function dayKeyForTimeZone(
  date = new Date(),
  timeZone?: string
): string {
  const parts = calendarDateInTimeZone(date, normalizeWordleTimeZone(timeZone))
  const month = String(parts.month).padStart(2, "0")
  const day = String(parts.day).padStart(2, "0")
  return `${parts.year}-${month}-${day}`
}

export function dailyPuzzleNumberForTimeZone(
  date = new Date(),
  timeZone?: string
): number {
  const calendarDate = utcDateFromCalendarParts(
    calendarDateInTimeZone(date, normalizeWordleTimeZone(timeZone))
  )
  return (
    Math.round(
      (calendarDate.getTime() - WORDLE_DAILY_EPOCH_DATE.getTime()) / DAY_MS
    ) + 1
  )
}

export function nextDailyPuzzleBoundaryUtcMs(
  date = new Date(),
  timeZone?: string
): number {
  const normalizedTimeZone = normalizeWordleTimeZone(timeZone)
  const tomorrow = addCalendarDays(
    calendarDateInTimeZone(date, normalizedTimeZone),
    1
  )
  return startOfCalendarDayUtcMs(tomorrow, normalizedTimeZone)
}

export type WordleTodayMeta = { dayKey: string; puzzleNumber: number }

export function getWordleTodayMeta(timeZone?: string): WordleTodayMeta {
  const now = new Date()
  return {
    dayKey: dayKeyForTimeZone(now, timeZone),
    puzzleNumber: dailyPuzzleNumberForTimeZone(now, timeZone),
  }
}
