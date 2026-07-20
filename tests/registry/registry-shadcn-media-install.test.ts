import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  getInstallCommand,
  installCommandWithMediaFetch,
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

  it("templates use shadcn init --template next with the registry item URL", () => {
    const install = getInstallCommand("portfolio-v1")
    expect(install.command).toBe(
      'npx shadcn@latest init --template next -y "https://uiception.com/r/portfolio-v1.json"',
    )
    expect(install.display).toBe("npx shadcn init portfolio-v1")
  })

  it("no block depends on uiception-media-fetch", () => {
    const { items } = loadRegistry()
    for (const item of items) {
      const hasDep = (item.registryDependencies ?? []).some((d) =>
        d.includes("uiception-media-fetch"),
      )
      expect(
        hasDep,
        `${item.name}: remove the uiception-media-fetch registryDependency — media is now served via CDN URLs`,
      ).toBe(false)
    }
  })

  it("uiception-media-fetch block no longer exists in the registry", () => {
    const { items } = loadRegistry()
    const fetchItem = items.find((i) => i.name === "uiception-media-fetch")
    expect(
      fetchItem,
      "uiception-media-fetch should be removed from registry.json",
    ).toBeUndefined()
  })
})
