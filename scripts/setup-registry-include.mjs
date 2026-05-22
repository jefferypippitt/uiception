/**
 * Applies shadcn May 2026 registry updates: @ui/@lib target aliases on all items.
 * Writes items to root registry.json (include is not compatible with shared
 * components/ui and public/ paths in this repo — shadcn validate requires
 * chunk-local paths without .. traversal).
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const schema = "https://ui.shadcn.com/schema/registry.json"
const registryPath = join(root, "registry.json")
const blocksRegistryPath = join(root, "registry/blocks/registry.json")

/** @param {string} target */
function migrateTarget(target) {
  if (target.startsWith("components/ui/")) {
    return `@ui/${target.slice("components/ui/".length)}`
  }
  if (target.startsWith("lib/")) {
    return `@lib/${target.slice("lib/".length)}`
  }
  if (target.startsWith("hooks/")) {
    return `@hooks/${target.slice("hooks/".length)}`
  }
  return target
}

function loadItems() {
  try {
    const blocks = JSON.parse(readFileSync(blocksRegistryPath, "utf8"))
    if (blocks.items?.length) return blocks.items
  } catch {
    // fall through
  }
  const source = JSON.parse(readFileSync(registryPath, "utf8"))
  return source.items ?? []
}

const items = loadItems().map((item) => ({
  ...item,
  files: (item.files ?? []).map((f) => ({
    ...f,
    target: migrateTarget(f.target),
  })),
}))

const source = JSON.parse(readFileSync(registryPath, "utf8"))

writeFileSync(
  registryPath,
  `${JSON.stringify(
    {
      $schema: schema,
      name: source.name,
      homepage: source.homepage,
      items,
    },
    null,
    2,
  )}\n`,
)

console.log(`Updated root registry.json with ${items.length} items (@ui/@lib targets).`)
