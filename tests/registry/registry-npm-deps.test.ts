import { readFileSync } from "node:fs"
import { join } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const registryPath = join(root, "registry.json")

type RegistryItem = { name?: string; type?: string; dependencies?: string[] }

function loadRegistry(): { items: RegistryItem[] } {
  return JSON.parse(readFileSync(registryPath, "utf8")) as { items: RegistryItem[] }
}

// Packages always present in a Next.js + shadcn project — don't need to be declared per-block
const ALWAYS_AVAILABLE_EXACT = new Set([
  "react",
  "react-dom",
  "next",
  "lucide-react",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "next-themes",
])

const ALWAYS_AVAILABLE_PREFIX = [
  "next/",       // next/image, next/link, etc.
  "react/",      // react/jsx-runtime, etc.
  "@radix-ui/",  // shadcn peer deps
  "node:",       // node built-ins
]

const NODE_BUILTINS = new Set([
  "fs", "path", "os", "crypto", "stream", "util",
  "events", "url", "http", "https", "child_process", "buffer",
])

/** Extract bare package name from an import specifier.
 *  "gsap/ScrollTrigger" -> "gsap"
 *  "@paper-design/shaders-react" -> "@paper-design/shaders-react"
 *  "motion/react" -> "motion"
 */
function packageName(specifier: string): string {
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/")
    return `${parts[0]}/${parts[1]}`
  }
  return specifier.split("/")[0]
}

/** Strip version suffix from a dependency declaration: "geist@^1.7.0" -> "geist" */
function stripVersion(dep: string): string {
  const at = dep.lastIndexOf("@")
  return at > 0 ? dep.slice(0, at) : dep
}

function isAlwaysAvailable(pkg: string): boolean {
  if (ALWAYS_AVAILABLE_EXACT.has(pkg)) return true
  if (NODE_BUILTINS.has(pkg)) return true
  return ALWAYS_AVAILABLE_PREFIX.some((prefix) => pkg.startsWith(prefix))
}

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//
const IMPORT_FROM_RE = /^import\b[^"'\n]*\bfrom\s+["']([^"']+)["']/gm

describe("registry npm dependencies", () => {
  it("declares every third-party import in the block's dependencies array", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")
    const byName = new Map(blocks.map((b) => [b.name!, b]))

    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    for (const rel of sources) {
      const blockMatch = rel.match(BLOCK_DIR_RE)
      if (!blockMatch) continue
      const blockName = blockMatch[1]
      const block = byName.get(blockName)
      if (!block) continue

      const declared = new Set(
        (block.dependencies ?? []).map((d) => stripVersion(d)),
      )

      const content = readFileSync(join(root, rel), "utf8")
      let m: RegExpExecArray | null
      IMPORT_FROM_RE.lastIndex = 0
      while ((m = IMPORT_FROM_RE.exec(content)) !== null) {
        const specifier = m[1]
        // skip relative and @/ alias imports
        if (specifier.startsWith(".") || specifier.startsWith("@/")) continue
        const pkg = packageName(specifier)
        if (isAlwaysAvailable(pkg)) continue
        expect(
          declared.has(pkg),
          `${rel}: imports "${pkg}" but it is missing from dependencies in registry.json for block "${blockName}"`,
        ).toBe(true)
      }
    }
  })
})
