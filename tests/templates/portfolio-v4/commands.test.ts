import { describe, expect, it } from "vitest"

import { shouldShowAscii, ASCII_MIN_COLS, ASCII_ART } from "@/registry/new-york/templates/portfolio-v4/lib/ascii"
import {
  MAX_COMMAND_HISTORY,
  MAX_SCROLLBACK_ENTRIES,
  capScrollback,
  getPromptPrefix,
  getWelcomeLines,
  pushCommand,
  runCommand,
  type TerminalLine,
} from "@/registry/new-york/templates/portfolio-v4/lib/commands"
import { portfolio } from "@/registry/new-york/templates/portfolio-v4/lib/portfolio"

/** Flatten a rendered line to its visible text. */
function lineText(line: TerminalLine): string {
  return line.segments.map((s) => s.value).join("")
}

function allText(lines: TerminalLine[]): string {
  return lines.map(lineText).join("\n")
}

describe("portfolio-v4 shouldShowAscii", () => {
  it("hides the banner below the minimum column count", () => {
    expect(shouldShowAscii(ASCII_MIN_COLS - 1)).toBe(false)
  })

  it("shows the banner at or above the minimum column count", () => {
    expect(shouldShowAscii(ASCII_MIN_COLS)).toBe(true)
    expect(shouldShowAscii(120)).toBe(true)
  })
})

describe("portfolio-v4 getWelcomeLines", () => {
  it("renders the ASCII banner when there's room for it", () => {
    const text = allText(getWelcomeLines(80))
    for (const row of ASCII_ART) {
      expect(text).toContain(row)
    }
  })

  it("falls back to a plain name heading on a narrow terminal", () => {
    const lines = getWelcomeLines(20)
    const text = allText(lines)
    expect(text).toContain(portfolio.name)
    expect(text).toContain("=======")
    for (const row of ASCII_ART) {
      expect(text).not.toContain(row)
    }
  })

  it("lists the common commands and the ls hint", () => {
    const text = allText(getWelcomeLines(80))
    expect(text).toContain(portfolio.tagline)
    expect(text).toContain("Commands:")
    for (const cmd of ["about", "work", "projects", "resume", "help"]) {
      expect(text).toContain(cmd)
    }
    expect(text).toContain("Try:")
  })
})

describe("portfolio-v4 runCommand", () => {
  it("returns nothing for an empty input", () => {
    expect(runCommand("   ")).toEqual({ kind: "output", lines: [] })
  })

  it("reports unknown commands like bash", () => {
    const result = runCommand("frobnicate")
    expect(result.kind).toBe("output")
    if (result.kind !== "output") return
    expect(allText(result.lines)).toContain("bash: frobnicate: command not found")
  })

  it("signals a screen clear", () => {
    expect(runCommand("clear")).toEqual({ kind: "clear" })
  })

  it("normalises a leading slash and casing", () => {
    const result = runCommand("/HELP")
    expect(result.kind).toBe("output")
    if (result.kind !== "output") return
    expect(allText(result.lines)).toContain("Available commands")
  })

  it("lists every portfolio entry for `ls`", () => {
    const result = runCommand("ls", 80)
    expect(result.kind).toBe("output")
    if (result.kind !== "output") return
    const text = allText(result.lines)
    for (const entry of [
      "about",
      "destinations",
      "events",
      "help",
      "projects",
      "resume",
      "work",
    ]) {
      expect(text).toContain(entry)
    }
  })

  it("wraps the `ls` listing to more rows on a narrow terminal", () => {
    const wide = runCommand("ls", 200)
    const narrow = runCommand("ls", 20)
    if (wide.kind !== "output" || narrow.kind !== "output") throw new Error("expected output")
    expect(narrow.lines.length).toBeGreaterThan(wide.lines.length)
  })

  it.each(["about", "work", "projects", "resume", "destinations", "events", "help"])(
    "produces output for `%s`",
    (cmd) => {
      const result = runCommand(cmd, 80)
      expect(result.kind).toBe("output")
      if (result.kind !== "output") return
      expect(result.lines.length).toBeGreaterThan(0)
    },
  )

  it("puts the name and title in the `about` header", () => {
    const result = runCommand("about")
    if (result.kind !== "output") throw new Error("expected output")
    expect(allText(result.lines)).toContain(`${portfolio.name} — ${portfolio.title}`)
  })
})

describe("portfolio-v4 getPromptPrefix", () => {
  it("is a bash-style prompt", () => {
    expect(getPromptPrefix()).toBe("$ ")
  })
})

describe("portfolio-v4 history + scrollback bounds", () => {
  it("pushCommand appends to the end", () => {
    expect(pushCommand(["a", "b"], "c")).toEqual(["a", "b", "c"])
  })

  it("pushCommand keeps only the newest MAX_COMMAND_HISTORY", () => {
    const full = Array.from({ length: MAX_COMMAND_HISTORY }, (_, i) => `c${i}`)
    const next = pushCommand(full, "newest")
    expect(next).toHaveLength(MAX_COMMAND_HISTORY)
    expect(next.at(-1)).toBe("newest")
    expect(next[0]).toBe("c1")
  })

  it("capScrollback returns the same array when under the cap", () => {
    const entries = [{ id: 1 }, { id: 2 }]
    expect(capScrollback(entries)).toBe(entries)
  })

  it("capScrollback drops the oldest groups past the cap", () => {
    const entries = Array.from(
      { length: MAX_SCROLLBACK_ENTRIES + 5 },
      (_, i) => ({ id: i })
    )
    const capped = capScrollback(entries)
    expect(capped).toHaveLength(MAX_SCROLLBACK_ENTRIES)
    expect(capped[0]).toEqual({ id: 5 })
  })
})
