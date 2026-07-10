import { describe, expect, it } from "vitest"
import { scoreGuess } from "@/lib/wordle/score"

describe("scoreGuess", () => {
  it("marks every tile correct when guess equals solution", () => {
    expect(scoreGuess("apple", "apple")).toEqual([
      "correct", "correct", "correct", "correct", "correct",
    ])
  })

  it("marks every tile absent when no letters overlap", () => {
    expect(scoreGuess("bzzzz", "apple")).toEqual([
      "absent", "absent", "absent", "absent", "absent",
    ])
  })

  it("only credits a repeated guess letter once when the solution has it once (mixed case)", () => {
    expect(scoreGuess("sassy", "spans")).toEqual([
      "correct", "present", "present", "absent", "absent",
    ])
  })

  it("only credits a repeated guess letter once when the solution has it once (no exact matches)", () => {
    expect(scoreGuess("ssabc", "abcds")).toEqual([
      "present", "absent", "present", "present", "present",
    ])
  })
})
