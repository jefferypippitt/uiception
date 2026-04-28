import "server-only"

import { differenceInCalendarDays } from "date-fns"
import { dayStartInTimeZone, WORDLE_DAILY_EPOCH } from "./wordle-daily"
import { WORDLE_SOLUTIONS } from "./wordle-words"

function dailySolutionIndexForTimeZone(date = new Date(), timeZone?: string): number {
  const n = differenceInCalendarDays(dayStartInTimeZone(date, timeZone), WORDLE_DAILY_EPOCH)
  const m = WORDLE_SOLUTIONS.length
  return ((n % m) + m) % m
}

export function dailySolutionForTimeZone(date = new Date(), timeZone?: string): string {
  return WORDLE_SOLUTIONS[dailySolutionIndexForTimeZone(date, timeZone)]!
}
