import "server-only"

import { WORDLE_SOLUTIONS } from "@/lib/wordle/words"

export function solutionForPuzzleNumber(puzzleNumber: number): string {
  const n = puzzleNumber - 1
  const m = WORDLE_SOLUTIONS.length
  const index = ((n % m) + m) % m
  return WORDLE_SOLUTIONS[index]!
}
