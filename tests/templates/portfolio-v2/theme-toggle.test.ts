import { describe, expect, it } from "vitest"
import { shouldAllowToggle } from "@/registry/new-york/templates/portfolio-v2/components/theme-toggle"

describe("shouldAllowToggle", () => {
  it("blocks a re-trigger inside the cooldown window", () => {
    expect(shouldAllowToggle(1000, 1000 + 649)).toBe(false)
  })

  it("allows a re-trigger once the cooldown window has elapsed", () => {
    expect(shouldAllowToggle(1000, 1000 + 650)).toBe(true)
  })

  it("allows the very first toggle (lastToggleAt = 0)", () => {
    expect(shouldAllowToggle(0, Date.now())).toBe(true)
  })
})
