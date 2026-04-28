import { dailyPuzzleNumberForTimeZone, dayKeyForTimeZone } from "@/lib/wordle-daily"

export type WordleTodayMeta = {
  dayKey: string
  puzzleNumber: number
}

export function getWordleTodayMeta(timeZone?: string): WordleTodayMeta {
  const now = new Date()
  return {
    dayKey: dayKeyForTimeZone(now, timeZone),
    puzzleNumber: dailyPuzzleNumberForTimeZone(now, timeZone),
  }
}


