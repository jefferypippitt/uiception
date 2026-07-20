import { existsSync, readFileSync } from "node:fs"
import { dirname, join, normalize, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")

function resolveWithExtensions(absBase: string): string | null {
  const candidates = [
    absBase,
    `${absBase}.tsx`,
    `${absBase}.ts`,
    `${absBase}.css`,
    join(absBase, "index.tsx"),
    join(absBase, "index.ts"),
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return null
}

function resolveSpecifier(specifier: string, fromFile: string): string | null {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2)
    return resolveWithExtensions(join(root, rel))
  }
  if (specifier.startsWith(".")) {
    const base = dirname(fromFile)
    return resolveWithExtensions(normalize(resolve(base, specifier)))
  }
  return null
}

function collectSpecifiers(source: string): string[] {
  const out: string[] = []
  for (const m of source.matchAll(/\bfrom\s+["']([^"']+)["']/g)) {
    out.push(m[1])
  }
  for (const m of source.matchAll(/\bimport\s+["']([^"']+)["']/g)) {
    out.push(m[1])
  }
  return out
}

describe("registry block imports", () => {
  it("resolves relative and @/ imports from block sources to existing files", () => {
    const sources = [
      ...listTsSourcesUnder(join(root, "registry/new-york/blocks"), root),
      ...listTsSourcesUnder(join(root, "registry/new-york/templates"), root),
    ]

    for (const rel of sources) {
      const absFile = join(root, rel)
      const content = readFileSync(absFile, "utf8")
      const specs = collectSpecifiers(content)

      for (const spec of specs) {
        // Install-time @/components/* and @/lib/* (non-ui) resolve after shadcn add;
        // skip when the path does not exist in this monorepo yet.
        if (
          spec.startsWith("@/components/") &&
          !spec.startsWith("@/components/ui/")
        ) {
          continue
        }
        if (
          spec.startsWith("@/lib/") &&
          !existsSync(join(root, spec.slice(2) + ".ts")) &&
          !existsSync(join(root, spec.slice(2) + ".tsx"))
        ) {
          continue
        }

        const resolved = resolveSpecifier(spec, absFile)
        if (resolved === null) continue
        expect(
          existsSync(resolved),
          `${rel}: import "${spec}" should resolve to ${resolved}`,
        ).toBe(true)
      }
    }
  })
})
