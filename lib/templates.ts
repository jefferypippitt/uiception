export type TemplateCategoryId = "portfolio"

export type TemplateVersion = {
  id: string
  title: string
  registryPath: string
  description?: string
}

export type TemplateCategory = {
  id: TemplateCategoryId
  title: string
  description: string
  versions: TemplateVersion[]
}

export const templateCategories: TemplateCategory[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    description: "For developers, writers, and personal websites.",
    versions: [
      {
        id: "portfolio-v1",
        title: "Portfolio v1",
        registryPath: "registry/new-york/templates/portfolio-v1",
        description:
          "Minimal Next.js starter for a physicist and science communicator — writing, books, and a Basin contact form.",
      },
    ],
  },
]

export function getTemplateVersion(id: string): TemplateVersion | undefined {
  for (const category of templateCategories) {
    const version = category.versions.find((v) => v.id === id)
    if (version) return version
  }
  return undefined
}

export function getFreeTemplateVersions(): TemplateVersion[] {
  return templateCategories.flatMap((category) =>
    category.versions.filter((v) => v.registryPath)
  )
}
