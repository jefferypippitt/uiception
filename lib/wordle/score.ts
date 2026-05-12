export type WordleTileResult = "correct" | "present" | "absent"

const COLS = 5

export function scoreGuess(
  guess: string,
  solution: string
): WordleTileResult[] {
  const out: WordleTileResult[] = Array.from({ length: COLS }, () => "absent")
  const remaining = new Map<string, number>()

  for (const char of solution) {
    remaining.set(char, (remaining.get(char) ?? 0) + 1)
  }

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === solution[i]) {
      out[i] = "correct"
      const char = guess[i]!
      remaining.set(char, (remaining.get(char) ?? 1) - 1)
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (out[i] === "correct") continue

    const char = guess[i]!
    const count = remaining.get(char) ?? 0
    if (count > 0) {
      out[i] = "present"
      remaining.set(char, count - 1)
    }
  }

  return out
}
