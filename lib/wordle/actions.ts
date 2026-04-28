"use server"

import { dailyPuzzleNumberForTimeZone, WORDLE_DAILY_EPOCH } from "@/lib/wordle-daily"
import { dailySolutionForTimeZone } from "@/lib/wordle-daily-server"
import { scoreGuess, type WordleTileResult } from "@/lib/wordle-score"
import { ALLOWED_GUESSES } from "@/lib/wordle-words"

export type WordleGuessActionResult =
  | {
      ok: true
      scores: WordleTileResult[]
      won: boolean
      lost: boolean
      answer?: string
    }
  | {
      ok: false
      error: "bad_guess" | "bad_row" | "not_in_list" | "bad_puzzle"
    }

export async function submitWordleGuess(
  guess: string,
  row: number,
  puzzleNumber?: number,
  timeZone?: string
): Promise<WordleGuessActionResult> {
  const guessRaw = typeof guess === "string" ? guess.toLowerCase().trim() : ""
  if (guessRaw.length !== 5 || !/^[a-z]{5}$/.test(guessRaw)) {
    return { ok: false, error: "bad_guess" }
  }
  if (!Number.isInteger(row) || row < 0 || row > 5) {
    return { ok: false, error: "bad_row" }
  }
  if (!ALLOWED_GUESSES.has(guessRaw)) {
    return { ok: false, error: "not_in_list" }
  }

  const todayPuzzleNumber = dailyPuzzleNumberForTimeZone(new Date(), timeZone)
  const targetPuzzleNumber = puzzleNumber == null ? todayPuzzleNumber : puzzleNumber
  if (
    !Number.isInteger(targetPuzzleNumber) ||
    targetPuzzleNumber < 1 ||
    targetPuzzleNumber > todayPuzzleNumber
  ) {
    return { ok: false, error: "bad_puzzle" }
  }

  const date = new Date(WORDLE_DAILY_EPOCH)
  date.setUTCDate(date.getUTCDate() + (targetPuzzleNumber - 1))
  const solution = dailySolutionForTimeZone(date, timeZone)
  const scores = scoreGuess(guessRaw, solution)
  const won = guessRaw === solution
  const lost = !won && row === 5

  return {
    ok: true,
    scores,
    won,
    lost,
    ...(lost ? { answer: solution } : {}),
  }
}
