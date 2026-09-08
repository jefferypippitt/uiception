import { describe, expect, it } from "vitest"

import * as v3 from "@/registry/new-york/blocks/changelog-section-v3/lib/changelog-format"
import * as v4 from "@/registry/new-york/blocks/changelog-section-v4/lib/changelog-format"

const variants = [
  ["changelog-section-v3", v3],
  ["changelog-section-v4", v4],
] as const

describe.each(variants)("%s changelog-format", (_name, mod) => {
  describe("formatChangelogDate", () => {
    it("formats a valid ISO date as `D Month YYYY`", () => {
      expect(mod.formatChangelogDate("2026-09-02")).toBe("2 September 2026")
      expect(mod.formatChangelogDate("2026-01-31")).toBe("31 January 2026")
      expect(mod.formatChangelogDate("2026-12-01")).toBe("1 December 2026")
    })

    it("returns the raw string for a malformed date instead of `undefined`/`NaN`", () => {
      for (const bad of ["2026/09/02", "2026-13-02", "2026-00-10", "not-a-date", "2026-09"]) {
        expect(mod.formatChangelogDate(bad)).toBe(bad)
      }
    })
  })

  describe("formatContributorNames", () => {
    const p = (name: string) => ({ id: name, name, initials: "XX", avatarSrc: "" })

    it("spells out one or two names in full", () => {
      expect(mod.formatContributorNames([p("Ada")])).toBe("Ada")
      expect(mod.formatContributorNames([p("Ada"), p("Bo")])).toBe("Ada, Bo")
    })

    it("folds three into `and 1 other` (singular)", () => {
      expect(mod.formatContributorNames([p("Ada"), p("Bo"), p("Cy")])).toBe(
        "Ada, Bo, and 1 other"
      )
    })

    it("folds four+ into `and N others` (plural)", () => {
      expect(
        mod.formatContributorNames([p("Ada"), p("Bo"), p("Cy"), p("Di")])
      ).toBe("Ada, Bo, and 2 others")
    })
  })

  describe("groupEntriesByDate", () => {
    const entry = (id: string, date: string) => ({
      id,
      date,
      title: id,
      description: "",
      contributors: [],
    })

    it("orders groups newest date first", () => {
      const groups = mod.groupEntriesByDate([
        entry("a", "2026-01-01"),
        entry("b", "2026-03-01"),
        entry("c", "2026-02-01"),
      ])
      expect(groups.map((g) => g.date)).toEqual([
        "2026-03-01",
        "2026-02-01",
        "2026-01-01",
      ])
    })

    it("merges entries that share a date into one group", () => {
      const groups = mod.groupEntriesByDate([
        entry("a", "2026-03-01"),
        entry("b", "2026-03-01"),
        entry("c", "2026-02-01"),
      ])
      expect(groups).toHaveLength(2)
      expect(groups[0].entries.map((e) => e.id)).toEqual(["a", "b"])
      expect(groups[0].label).toBe("1 March 2026")
    })
  })
})
