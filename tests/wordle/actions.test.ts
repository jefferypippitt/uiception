import { describe, expect, it } from "vitest"
import { submitWordleGuess } from "@/lib/wordle/actions"
import { solutionForPuzzleNumber } from "@/lib/wordle/answer"
import { dailyPuzzleNumberForTimeZone } from "@/lib/wordle/daily"
import { ALLOWED_GUESSES } from "@/lib/wordle/words"

const PUZZLE_1_SOLUTION = solutionForPuzzleNumber(1)

describe("submitWordleGuess — input validation", () => {
  it("rejects a guess that isn't 5 letters", async () => {
    const result = await submitWordleGuess("ab", 0, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_guess" })
  })

  it("rejects a guess with non-letter characters", async () => {
    const result = await submitWordleGuess("ab1de", 0, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_guess" })
  })

  it("rejects an out-of-range row", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 6, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_row" })
  })

  it("rejects a non-integer row", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 1.5, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_row" })
  })

  it("rejects a guess not in the allowed word list", async () => {
    const notAWord = "qzxjk"
    expect(ALLOWED_GUESSES.has(notAWord)).toBe(false) // precondition
    const result = await submitWordleGuess(notAWord, 0, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "not_in_list" })
  })

  it("rejects a puzzle number greater than today's", async () => {
    const todayPuzzleNumber = dailyPuzzleNumberForTimeZone(new Date(), "UTC")
    const result = await submitWordleGuess(
      PUZZLE_1_SOLUTION,
      0,
      todayPuzzleNumber + 1000,
      "UTC"
    )
    expect(result).toEqual({ ok: false, error: "bad_puzzle" })
  })

  it("rejects puzzle number 0", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 0, 0, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_puzzle" })
  })
})

describe("submitWordleGuess — happy path", () => {
  it("returns won: true and does not reveal the answer when the guess is correct", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 0, 1, "UTC")
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.won).toBe(true)
    expect(result.lost).toBe(false)
    expect(result.scores).toEqual(["correct", "correct", "correct", "correct", "correct"])
    expect(result).not.toHaveProperty("answer")
  })

  it("returns lost: true and reveals the answer on the final row with a wrong guess", async () => {
    const wrongGuess = [...ALLOWED_GUESSES].find((w) => w !== PUZZLE_1_SOLUTION)
    if (!wrongGuess) throw new Error("test setup: no alternate word found in ALLOWED_GUESSES")

    const result = await submitWordleGuess(wrongGuess, 5, 1, "UTC")
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.won).toBe(false)
    expect(result.lost).toBe(true)
    expect(result.answer).toBe(PUZZLE_1_SOLUTION)
  })

  it("does not reveal the answer on a wrong guess before the final row", async () => {
    const wrongGuess = [...ALLOWED_GUESSES].find((w) => w !== PUZZLE_1_SOLUTION)
    if (!wrongGuess) throw new Error("test setup: no alternate word found in ALLOWED_GUESSES")

    const result = await submitWordleGuess(wrongGuess, 2, 1, "UTC")
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.won).toBe(false)
    expect(result.lost).toBe(false)
    expect(result).not.toHaveProperty("answer")
  })
})
