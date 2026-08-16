import { describe, expect, it } from "vitest"
import { shouldAllowToggle as portfolioV1 } from "@/registry/new-york/templates/portfolio-v1/components/theme-toggle"
import { shouldAllowToggle as portfolioV2 } from "@/registry/new-york/templates/portfolio-v2/components/theme-toggle"

describe.each([
  ["portfolio-v1", portfolioV1],
  ["portfolio-v2", portfolioV2],
] as const)("%s shouldAllowToggle", (_name, shouldAllowToggle) => {
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
