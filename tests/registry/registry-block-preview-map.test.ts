import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { blockCategories } from "@/lib/blocks"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

function extractPreviewMapKeys(): string[] {
  const filePath = join(root, "components/block-preview-by-version.tsx")
  const source = readFileSync(filePath, "utf8")

  const objMatch = source.match(/const blockComponents[^{]*\{([\s\S]*?)\n\}/)
  if (!objMatch) {
    throw new Error(
      "Could not find the `blockComponents` object literal in " +
        "components/block-preview-by-version.tsx — has its structure changed?"
    )
  }

  const body = objMatch[1]
  const keyRe = /^\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/gm
  const keys: string[] = []
  let match: RegExpExecArray | null
  while ((match = keyRe.exec(body))) {
    keys.push(match[1] ?? match[2])
  }
  return keys
}

describe("block identity stays in sync across lib/blocks.ts, the preview map, and registry.json", () => {
  const versionIds = blockCategories.flatMap((category) =>
    category.versions.map((version) => version.id)
  )
  const previewMapKeys = extractPreviewMapKeys()
  const { items } = loadRegistry()
  const registryBlockNames = new Set(
    items.filter((i) => i.type === "registry:block").map((i) => i.name)
  )

  it("has at least one version id (sanity check the extraction itself works)", () => {
    expect(versionIds.length).toBeGreaterThan(0)
    expect(previewMapKeys.length).toBeGreaterThan(0)
  })

  it("has a preview-map entry for every block version declared in lib/blocks.ts", () => {
    const missing = versionIds.filter((id) => !previewMapKeys.includes(id))
    expect(missing, `versions missing from block-preview-by-version.tsx: ${missing.join(", ")}`).toEqual([])
  })

  it("has no stale preview-map entries that don't correspond to a declared block version", () => {
    const stale = previewMapKeys.filter((key) => !versionIds.includes(key))
    expect(stale, `preview-map keys with no matching lib/blocks.ts version: ${stale.join(", ")}`).toEqual([])
  })

  it("has a registry.json block for every block version declared in lib/blocks.ts", () => {
    const missing = versionIds.filter((id) => !registryBlockNames.has(id))
    expect(missing, `versions missing from registry.json: ${missing.join(", ")}`).toEqual([])
  })
})
