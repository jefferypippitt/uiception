export type TemplateCategoryId = "portfolio" | "landing-pages"

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
      {
        id: "portfolio-v2",
        title: "Portfolio v2",
        registryPath: "registry/new-york/templates/portfolio-v2",
        description:
          "Static personal site — notes, projects, and experience hardcoded in pages. No CMS or markdown.",
      },
      {
        id: "portfolio-v3",
        title: "Portfolio v3",
        registryPath: "registry/new-york/templates/portfolio-v3",
        description:
          "Scroll-scrubbed lifeline timeline for a fullstack developer — Jon Doe filler career. Drop media into public/images and public/videos.",
      },
      {
        id: "portfolio-v4",
        title: "Portfolio v4",
        registryPath: "registry/new-york/templates/portfolio-v4",
        description:
          "Bash-style terminal portfolio — type about, work, resume, help. Same Jon Doe career data as v3.",
      },
    ],
  },
  {
    id: "landing-pages",
    title: "Landing Pages",
    description: "For product launches, marketing sites, and campaigns.",
    versions: [
      {
        id: "landing-page-v1",
        title: "Landing Page v1",
        registryPath: "registry/new-york/templates/landing-page-v1",
        description:
          "Fullscreen startup waitlist — monochrome ink-print hero with a boiling misregistered title, Clerk <Waitlist /> (shadcn theme) on the right. Works keyless with a demo form.",
      },
      {
        id: "landing-page-v2",
        title: "Landing Page v2",
        registryPath: "registry/new-york/templates/landing-page-v2",
        description:
          "Event landing hero — brand-first display type over a WebGL color-field glow (noise warp, mouse pull, auto-cycling palettes), staggered blur reveal, ticket CTA into a multi-step questionnaire register with Base UI toast.",
      },
      {
        id: "landing-page-v3",
        title: "Landing Page v3",
        registryPath: "registry/new-york/templates/landing-page-v3",
        description:
          "Coming-soon countdown — a Solari split-flap board for Acme 2.0 that tracks light and dark, with mechanical flips on power-up and live days/hours/minutes/seconds.",
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
