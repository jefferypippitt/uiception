import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  curlInstallLines,
  installCommandWithMediaFetch,
  mediaFilesNeedingInstallFetch,
} from "@/lib/registry-install-media"
import {
  loadRegistry,
  registryProjectRoot as root,
  type RegistryItem,
} from "./load-registry"

function loadBuiltBlockManifest(blockName: string): RegistryItem | null {
  const manifestPath = join(root, "public/r", `${blockName}.json`)
  if (!existsSync(manifestPath)) return null
  return JSON.parse(readFileSync(manifestPath, "utf8")) as RegistryItem
}

function shadcnDryRunFiles(manifestUrl: string): string[] {
  const out = execSync(`pnpm exec shadcn add "${manifestUrl}" --dry-run`, {
    cwd: root,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  })
  const paths: string[] = []
  for (const line of out.split(/\r?\n/)) {
    const match = line.match(/^\s*[│|]\s*[+=]\s+(.+?)\s{2,}/)
    if (match) paths.push(match[1].replace(/\\/g, "/").trim())
  }
  return paths
}

describe("shadcn add + bundled media install", () => {
  it("built manifests list media that needs a post-install fetch", () => {
    const manifest = loadBuiltBlockManifest("macbook-pro-with-video")
    expect(manifest).toBeTruthy()

    const pending = mediaFilesNeedingInstallFetch(manifest!.files)
    expect(pending.map((f) => f.target)).toEqual([
      "public/videos/blocks/macbook-pro-with-video/screen-demo.mp4",
    ])
    expect(curlInstallLines(manifest!.files)).toHaveLength(1)
    expect(installCommandWithMediaFetch("macbook-pro-with-video", manifest!.files)).toContain(
      "curl -fsSL",
    )
  })

  it(
    "shadcn add dry-run does not create contentless registry:file media (regression)",
    () => {
    const manifest = loadBuiltBlockManifest("macbook-pro-with-video")
    const pending = mediaFilesNeedingInstallFetch(manifest!.files)
    expect(pending.length).toBeGreaterThan(0)

    const planned = shadcnDryRunFiles(
      "https://uiception.com/r/macbook-pro-with-video.json",
    )

    for (const file of pending) {
      const normalized = file.target!.replace(/\\/g, "/")
      expect(
        planned.some(
          (p) =>
            p.replace(/\\/g, "/") === normalized ||
            p.endsWith(normalized.split("/").pop()!),
        ),
        `shadcn dry-run unexpectedly plans ${normalized}; if this fails, remove the curl follow-up from installCommandWithMediaFetch`,
      ).toBe(false)
    }
  },
  30_000,
  )

  it("every block with stripped media has fetchable installUrl on the authoring disk", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const built = loadBuiltBlockManifest(block.name!)
      if (!built) continue
      const pending = mediaFilesNeedingInstallFetch(built.files)
      for (const file of pending) {
        const abs = join(root, file.target!)
        expect(
          existsSync(abs),
          `${block.name}: missing source file ${file.target} (installUrl would 404 for consumers)`,
        ).toBe(true)
        expect(file.meta?.installUrl).toMatch(
          new RegExp(`/${file.target!.replace(/^public\//, "")}$`),
        )
      }
    }
  })
})
