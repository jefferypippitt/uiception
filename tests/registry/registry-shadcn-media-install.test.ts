import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  installCommandWithMediaFetch,
  mediaFilesNeedingInstallFetch,
  pendingManifestFiles,
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

describe("shadcn add + bundled media install", () => {
  it("install command is shadcn add only", () => {
    const manifest = loadBuiltBlockManifest("hero-section-v1")
    expect(manifest).toBeTruthy()

    const command = installCommandWithMediaFetch("hero-section-v1", manifest!.files)
    expect(command).toBe(
      'npx shadcn@latest add "https://uiception.com/r/hero-section-v1.json"',
    )
    expect(command).not.toContain("curl")
  })

  it("built manifests include pending media manifest with content", () => {
    const manifest = loadBuiltBlockManifest("hero-section-v1")
    expect(manifest).toBeTruthy()

    const pending = pendingManifestFiles(manifest!.files)
    expect(pending).toHaveLength(1)
    expect(pending[0]?.target).toBe("lib/uiception-media/pending/hero-section-v1.json")

    const entries = JSON.parse(pending[0]!.content!) as Array<{
      target: string
      url: string
    }>
    expect(entries).toEqual([
      {
        target: "public/images/blocks/hero-section-v1/hero-section-v1-bg.png",
        url: "https://uiception.com/images/blocks/hero-section-v1/hero-section-v1-bg.png",
      },
    ])
  })

  it("built manifests depend on uiception-media-fetch for blocks with media", () => {
    const manifest = loadBuiltBlockManifest("hero-section-v1")
    expect(manifest?.registryDependencies).toContain(
      "https://uiception.com/r/uiception-media-fetch.json",
    )
  })

  it("uiception-media-fetch ships instrumentation and fetch script with content", () => {
    const manifest = loadBuiltBlockManifest("uiception-media-fetch")
    expect(manifest).toBeTruthy()

    const byTarget = new Map(
      (manifest!.files ?? []).map((file) => [file.target, file] as const),
    )

    const instrumentation = byTarget.get("instrumentation.ts")?.content ?? ""
    expect(instrumentation).toContain("setupUiceptionMedia")
    expect(instrumentation).not.toContain("pathToFileURL")
    expect(instrumentation).toContain(
      './lib/uiception-media/setup-uiception-media.mjs"',
    )
    expect(byTarget.get("lib/uiception-media/fetch-uiception-media.mjs")?.content).toContain(
      "ensureUiceptionBlockMedia",
    )
    expect(byTarget.get("lib/uiception-media/setup-uiception-media.mjs")?.content).toContain(
      "patchPackageScripts",
    )
  })

  it("binary media entries stay contentless while pending manifest carries URLs", () => {
    const manifest = loadBuiltBlockManifest("macbook-pro-with-video")
    expect(manifest).toBeTruthy()

    const pending = pendingManifestFiles(manifest!.files)
    const stripped = mediaFilesNeedingInstallFetch(manifest!.files)
    expect(pending).toHaveLength(1)
    expect(stripped).toHaveLength(1)
    expect(stripped[0]?.content).toBeUndefined()
    expect(pending[0]?.content).toContain("screen-demo.mp4")
  })

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
