import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")

export type RegistryFile = {
  path: string
  target: string
  type: string
  content?: string
  meta?: Record<string, unknown>
}

export type RegistryItem = {
  name?: string
  type?: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

type RegistryManifest = {
  items?: RegistryItem[]
  include?: string[]
}

function readJson(path: string): RegistryManifest {
  return JSON.parse(readFileSync(path, "utf8")) as RegistryManifest
}

function resolveInclude(manifestPath: string, includePath: string): RegistryItem[] {
  const full = join(dirname(manifestPath), includePath)
  if (!existsSync(full)) {
    throw new Error(`Included registry not found: ${full}`)
  }
  const included = readJson(full)
  return included.items ?? []
}

/** Load all registry items from root registry.json (supports `include`). */
export function loadRegistryItems(): RegistryItem[] {
  const registryPath = join(root, "registry.json")
  const manifest = readJson(registryPath)

  if (manifest.items?.length) {
    return manifest.items
  }

  const items: RegistryItem[] = []
  for (const rel of manifest.include ?? []) {
    items.push(...resolveInclude(registryPath, rel))
  }
  return items
}

export function loadRegistry(): { items: RegistryItem[] } {
  return { items: loadRegistryItems() }
}

/** Resolve a registry file `path` to an absolute path on disk. */
export function resolveSourcePath(_blockName: string, registryPath: string): string {
  return join(root, registryPath)
}

export { root as registryProjectRoot }
