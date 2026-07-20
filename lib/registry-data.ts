import registry from "@/registry.json"
import { getFreeTemplateVersions } from "@/lib/templates"

export type RegistryItemSummary = {
  name: string
  title: string
  description: string
}

const items = registry.items as RegistryItemSummary[]

const templateIds = new Set(
  getFreeTemplateVersions().map((version) => version.id)
)

/** Block ids only — templates use the same /view/[versionId] route with slug segments. */
export const registryBlockNames = items
  .map((item) => item.name)
  .filter((name) => !templateIds.has(name))

export function getRegistryItemByName(name: string): RegistryItemSummary | undefined {
  return items.find((item) => item.name === name)
}

export function isKnownBlockVersion(versionId: string): boolean {
  if (templateIds.has(versionId)) return false
  return items.some((item) => item.name === versionId)
}
