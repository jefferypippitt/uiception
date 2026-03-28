import registry from "@/registry.json"

export type RegistryItemSummary = {
  name: string
  title: string
  description: string
}

const items = registry.items as RegistryItemSummary[]

export const registryBlockNames = items.map((item) => item.name)

export function getRegistryItemByName(name: string): RegistryItemSummary | undefined {
  return items.find((item) => item.name === name)
}

export function isKnownBlockVersion(versionId: string): boolean {
  return items.some((item) => item.name === versionId)
}
