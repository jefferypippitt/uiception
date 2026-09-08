import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { registryProjectRoot as root } from "./load-registry"

/** Pull the `key: value` pairs out of a top-level `overrides:` block in a YAML
 *  file, normalising away quote characters. */
function parseOverridesBlock(yaml: string): Record<string, string> {
  const lines = yaml.split(/\r?\n/)
  const start = lines.findIndex((l) => l.trimEnd() === "overrides:")
  if (start === -1) throw new Error("no `overrides:` block found")

  const out: Record<string, string> = {}
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === "") break
    if (!/^\s+\S/.test(line)) break // dedented back to a new top-level key
    const m = line.match(/^\s+(.+?):\s*(.+?)\s*$/)
    if (!m) continue
    const key = m[1].trim().replace(/^['"]|['"]$/g, "")
    const value = m[2].trim().replace(/^['"]|['"]$/g, "")
    out[key] = value
  }
  return out
}

/** Does `version` satisfy the caret range `^A.B.C` (same major, >= A.B.C)? */
function satisfiesCaret(range: string, version: string): boolean {
  const r = range.replace(/^\^/, "").split(".").map(Number)
  const v = version.split(".").map(Number)
  if (v[0] !== r[0]) return false
  if (v[1] !== r[1]) return v[1] > r[1]
  return (v[2] ?? 0) >= (r[2] ?? 0)
}

const workspace = readFileSync(join(root, "pnpm-workspace.yaml"), "utf8")
const lock = readFileSync(join(root, "pnpm-lock.yaml"), "utf8")

const declared = parseOverridesBlock(workspace)
const effective = parseOverridesBlock(lock)

describe("pnpm-workspace.yaml overrides are applied", () => {
  it("the lockfile's overrides header matches pnpm-workspace.yaml", () => {
    expect(effective).toEqual(declared)
  })

  const simple = Object.entries(declared).filter(([key]) => !key.includes(">"))

  it.each(simple)(
    "%s resolves at or above its pinned floor in the lockfile",
    (pkg, range) => {
      const escaped = pkg.replace(/[.@/]/g, "\\$&")
      const re = new RegExp(`^\\s+'?${escaped}'?@(\\d+\\.\\d+\\.\\d+)`, "gm")
      const found = [...lock.matchAll(re)].map((m) => m[1])
      expect(
        found.length,
        `no resolved ${pkg} in pnpm-lock.yaml`,
      ).toBeGreaterThan(0)
      for (const version of found) {
        expect(
          satisfiesCaret(range, version),
          `${pkg}@${version} does not satisfy the pinned override ${range}`,
        ).toBe(true)
      }
    },
  )

  const scoped = Object.entries(declared).filter(([key]) => key.includes(">"))

  it.each(scoped)(
    "scoped override %s has a matching-major resolution present",
    (key, range) => {
      const child = key.split(">").pop()!
      const major = range.replace(/^\^/, "").split(".")[0]
      const re = new RegExp(`^\\s+'?${child}'?@${major}\\.`, "m")
      expect(
        re.test(lock),
        `expected a ${child}@${major}.x resolution in pnpm-lock.yaml for override ${key}`,
      ).toBe(true)
    },
  )
})
