export type WordleTileResult = "correct" | "present" | "absent"

const COLS = 5

export function scoreGuess(guess: string, solution: string): WordleTileResult[] {
  const out: WordleTileResult[] = Array.from({ length: COLS }, () => "absent")
  const remaining = new Map<string, number>()
  for (const c of solution) {
    remaining.set(c, (remaining.get(c) ?? 0) + 1)
  }
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === solution[i]) {
      out[i] = "correct"
      const c = guess[i]!
      remaining.set(c, (remaining.get(c) ?? 1) - 1)
    }
  }
  for (let i = 0; i < COLS; i++) {
    if (out[i] === "correct") continue
    const c = guess[i]!
    const n = remaining.get(c) ?? 0
    if (n > 0) {
      out[i] = "present"
      remaining.set(c, n - 1)
    }
  }
  return out
}
