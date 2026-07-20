import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

// shadcn component name -> the import path fragment it appears as
const SHADCN_COMPONENTS: Record<string, string> = {
  accordion: "components/ui/accordion",
  alert: "components/ui/alert",
  "alert-dialog": "components/ui/alert-dialog",
  "aspect-ratio": "components/ui/aspect-ratio",
  avatar: "components/ui/avatar",
  badge: "components/ui/badge",
  breadcrumb: "components/ui/breadcrumb",
  button: "components/ui/button",
  "button-group": "components/ui/button-group",
  calendar: "components/ui/calendar",
  card: "components/ui/card",
  carousel: "components/ui/carousel",
  chart: "components/ui/chart",
  checkbox: "components/ui/checkbox",
  collapsible: "components/ui/collapsible",
  combobox: "components/ui/combobox",
  command: "components/ui/command",
  "context-menu": "components/ui/context-menu",
  dialog: "components/ui/dialog",
  drawer: "components/ui/drawer",
  "dropdown-menu": "components/ui/dropdown-menu",
  field: "components/ui/field",
  "hover-card": "components/ui/hover-card",
  input: "components/ui/input",
  "input-otp": "components/ui/input-otp",
  label: "components/ui/label",
  menubar: "components/ui/menubar",
  "navigation-menu": "components/ui/navigation-menu",
  pagination: "components/ui/pagination",
  popover: "components/ui/popover",
  progress: "components/ui/progress",
  "radio-group": "components/ui/radio-group",
  resizable: "components/ui/resizable",
  "scroll-area": "components/ui/scroll-area",
  select: "components/ui/select",
  separator: "components/ui/separator",
  sheet: "components/ui/sheet",
  sidebar: "components/ui/sidebar",
  skeleton: "components/ui/skeleton",
  slider: "components/ui/slider",
  sonner: "components/ui/sonner",
  spinner: "components/ui/spinner",
  switch: "components/ui/switch",
  table: "components/ui/table",
  tabs: "components/ui/tabs",
  textarea: "components/ui/textarea",
  toggle: "components/ui/toggle",
  "toggle-group": "components/ui/toggle-group",
  tooltip: "components/ui/tooltip",
}

const BLOCK_DIR_RE = /registry\/new-york\/(?:blocks|templates)\/([^/]+)\//

describe("registry registryDependencies format", () => {
  it("uses full URLs (not @uiception/ aliases) for cross-registry dependencies", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")
    const blockNames = new Set(blocks.map((b) => b.name!))

    for (const block of blocks) {
      for (const dep of block.registryDependencies ?? []) {
        expect(
          dep,
          `${block.name}: registryDependency "${dep}" uses @uiception/ alias — use the full URL "https://uiception.com/r/<name>.json" so consumers without the registry alias can install it`,
        ).not.toMatch(/^@uiception\//)

        if (blockNames.has(dep)) {
          expect(
            dep,
            `${block.name}: registryDependency "${dep}" is a bare uiception block name — use "https://uiception.com/r/${dep}.json" so shadcn does not resolve it from ui.shadcn.com`,
          ).toMatch(/^https:\/\/uiception\.com\/r\/.+\.json$/)
        }
      }
    }
  })
})

describe("registry shadcn registryDependencies", () => {
  it("declares every imported shadcn component in registryDependencies", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")
    const byName = new Map(blocks.map((b) => [b.name!, b]))

    const sources = [
      ...listTsSourcesUnder(join(root, "registry/new-york/blocks"), root),
      ...listTsSourcesUnder(join(root, "registry/new-york/templates"), root),
    ]

    for (const rel of sources) {
      const blockMatch = rel.match(BLOCK_DIR_RE)
      if (!blockMatch) continue
      const blockName = blockMatch[1]
      const block = byName.get(blockName)
      if (!block) continue

      const content = readFileSync(join(root, rel), "utf8")
      const declared = new Set(block.registryDependencies ?? [])
      const shippedUi = new Set(
        (block.files ?? [])
          .map((f) => {
            const target = (f.target ?? "").replace(/\\/g, "/")
            const path = f.path.replace(/\\/g, "/")
            const match =
              target.match(/(?:^|\/)components\/ui\/([^/]+)\.tsx$/) ??
              target.match(/^@ui\/([^/]+)\.tsx$/) ??
              path.match(/\/components\/ui\/([^/]+)\.tsx$/)
            return match?.[1]
          })
          .filter((name): name is string => Boolean(name)),
      )

      for (const [dep, importFragment] of Object.entries(SHADCN_COMPONENTS)) {
        if (content.includes(`@/${importFragment}`)) {
          expect(
            declared.has(dep) || shippedUi.has(dep),
            `${rel}: imports "${importFragment}" but "${dep}" is missing from registryDependencies and is not shipped as components/ui/${dep}.tsx`,
          ).toBe(true)
        }
      }
    }
  })
})
