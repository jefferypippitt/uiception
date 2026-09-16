import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import { resolveAvatarSrc } from "@/registry/new-york/templates/portfolio-v6/lib/media"

const repoRoot = process.cwd()

describe("portfolio-v6 media", () => {
  const dirs: string[] = []

  afterEach(() => {
    for (const dir of dirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it("CDN-referenced demo avatar exists on the authoring disk", () => {
    const rel = "public/images/templates/portfolio-v6/avatar.png"
    expect(existsSync(join(repoRoot, rel)), `missing ${rel}`).toBe(true)
  })

  it("falls back to CDN when no local avatar exists", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "p6-app-"))
    dirs.push(tempRoot)
    mkdirSync(join(tempRoot, "public"), { recursive: true })

    const prev = process.cwd()
    process.chdir(tempRoot)
    try {
      expect(resolveAvatarSrc("https://example.com")).toBe(
        "https://example.com/images/templates/portfolio-v6/avatar.png"
      )
    } finally {
      process.chdir(prev)
    }
  })
})
