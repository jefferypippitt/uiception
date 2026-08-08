import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { getFreeTemplateVersions } from "@/lib/templates"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

function walk(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, results)
    else results.push(full.replace(/\\/g, "/"))
  }
  return results
}

function isTemplateItem(files: { path: string }[] | undefined): boolean {
  return (files ?? []).some((f) =>
    f.path.replace(/\\/g, "/").startsWith("registry/new-york/templates/")
  )
}

describe("template catalog stays in sync with registry.json", () => {
  const freeVersions = getFreeTemplateVersions()
  const { items } = loadRegistry()
  const templateItems = items.filter(
    (i) => i.type === "registry:block" && isTemplateItem(i.files)
  )
  const registryNames = new Set(templateItems.map((i) => i.name))

  it("has a registry.json item for every template with a registryPath", () => {
    const missing = freeVersions.filter((v) => !registryNames.has(v.id))
    expect(
      missing.map((v) => v.id),
      `templates missing from registry.json: ${missing.map((v) => v.id).join(", ")}`
    ).toEqual([])
  })
})

describe("template registry target paths", () => {
  it("template-owned files use clean root/components/content/lib/styles targets", () => {
    const { items } = loadRegistry()
    const templateItems = items.filter(
      (i) => i.type === "registry:block" && isTemplateItem(i.files)
    )

    const allowedPrefixes = [
      "app/",
      "components/",
      "lib/",
      "styles/",
      "content/",
      "public/",
      ".env",
      // Root-level Next.js request interceptor (Next 16 name for middleware.ts),
      // required by Clerk's clerkMiddleware().
      "proxy.ts",
    ]

    for (const item of templateItems) {
      const name = item.name!
      const templatePrefix = `registry/new-york/templates/${name}/`

      for (const f of item.files ?? []) {
        const path = f.path.replace(/\\/g, "/")
        if (!path.startsWith(templatePrefix)) continue

        expect(
          allowedPrefixes.some(
            (prefix) =>
              f.target === prefix ||
              f.target.startsWith(prefix) ||
              (prefix === ".env" && f.target.startsWith(".env"))
          ),
          `${name}: file "${path}" has unexpected target "${f.target}"`
        ).toBe(true)

        expect(
          f.target.startsWith(`app/${name}/`),
          `${name}: template must not install under app/${name}/ (got "${f.target}")`
        ).toBe(false)
      }
    }
  })

  it("declares every file in the template folder in registry.json", () => {
    const { items } = loadRegistry()
    const templateItems = items.filter(
      (i) => i.type === "registry:block" && isTemplateItem(i.files)
    )

    for (const item of templateItems) {
      const templateDir = join(root, "registry/new-york/templates", item.name!)
      if (!existsSync(templateDir)) {
        throw new Error(`Missing template folder: ${templateDir}`)
      }

      const declared = new Set(
        (item.files ?? []).map((f) => join(root, f.path).replace(/\\/g, "/"))
      )

      for (const file of walk(templateDir)) {
        expect(
          declared.has(file),
          `${item.name}: file on disk not declared in registry.json: ${file.replace(root.replace(/\\/g, "/") + "/", "")}`
        ).toBe(true)
      }
    }
  })
})

describe("template preview host", () => {
  it("registers a host preview entry for every catalog template", () => {
    const mapSource = readFileSync(
      join(root, "components/template-preview-by-version.tsx"),
      "utf8"
    )

    for (const version of getFreeTemplateVersions()) {
      expect(
        existsSync(join(root, "components/template-previews", `${version.id}.tsx`)),
        `${version.id}: missing components/template-previews/${version.id}.tsx`
      ).toBe(true)
      expect(
        mapSource.includes(`"${version.id}"`),
        `${version.id}: not registered in templatePreviews`
      ).toBe(true)
    }
  })
})

function extractTemplatePreviewKeys(): string[] {
  const filePath = join(root, "components/template-preview-by-version.tsx")
  const source = readFileSync(filePath, "utf8")

  const objMatch = source.match(/export const templatePreviews[^{]*\{([\s\S]*?)\n\}/)
  if (!objMatch) {
    throw new Error(
      "Could not find the `templatePreviews` object literal in " +
        "components/template-preview-by-version.tsx — has its structure changed?"
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

describe("template preview host has no stale entries", () => {
  it("has no template-preview-by-version.tsx entries with no matching lib/templates.ts version", () => {
    const versionIds = getFreeTemplateVersions().map((v) => v.id)
    const previewKeys = extractTemplatePreviewKeys()
    const stale = previewKeys.filter((key) => !versionIds.includes(key))
    expect(stale, `templatePreviews keys with no matching lib/templates.ts version: ${stale.join(", ")}`).toEqual([])
  })
})

describe("template catalog has no stale registry.json entries", () => {
  it("has no registry.json template item with no matching lib/templates.ts version", () => {
    const freeVersions = getFreeTemplateVersions()
    const versionIds = freeVersions.map((v) => v.id)
    const { items } = loadRegistry()
    const templateItems = items.filter(
      (i) => i.type === "registry:block" && isTemplateItem(i.files)
    )
    const registryNames = templateItems.map((i) => i.name)
    const stale = registryNames.filter((name) => !versionIds.includes(name!))
    expect(stale, `registry.json template entries with no matching lib/templates.ts version: ${stale.join(", ")}`).toEqual([])
  })
})
