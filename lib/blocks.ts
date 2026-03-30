export type BlockCategoryId =
  | "navbar"
  | "hero-section"
  | "brands"
  | "how-it-works"
  | "case-study"
  | "about-us"
  | "resources"
  | "value-proposition"
  | "features"
  | "integrations"
  | "pricing"
  | "testimonials"
  | "cta"
  | "faq"
  | "stats"
  | "footer"

export type BlockVersion = {
  id: string
  title: string
  registryPath: string
}

export type BlockCategory = {
  id: BlockCategoryId
  title: string
  description: string
  versions: BlockVersion[]
}

export const blockCategories: BlockCategory[] = [
  {
    id: "navbar",
    title: "Navbar",
    description: "Header and top-level navigation patterns.",
    versions: [],
  },
  {
    id: "hero-section",
    title: "Hero Section",
    description: "First-screen messaging and call-to-action sections.",
    versions: [
      {
        id: "hero-section-v1",
        title: "Hero Section v1",
        registryPath: "registry/new-york/blocks/hero-section-v1",
      },
      {
        id: "hero-section-v2",
        title: "Hero Section v2",
        registryPath: "registry/new-york/blocks/hero-section-v2",
      },
    ],
  },
  {
    id: "brands",
    title: "Brands",
    description: "Partner and entertainment brand strips with themed SVG logos.",
    versions: [
      {
        id: "brands-section-v1",
        title: "Brands Section v1",
        registryPath: "registry/new-york/blocks/brands-section-v1",
      },
      {
        id: "brands-section-v2",
        title: "Brands Section v2",
        registryPath: "registry/new-york/blocks/brands-section-v2",
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    description: "Showcase product features in grids or lists.",
    versions: [],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Show connected tools, platforms, and ecosystem compatibility.",
    versions: [
      {
        id: "mac-os-terminal",
        title: "Mac OS Terminal",
        registryPath: "registry/new-york/blocks/mac-os-terminal",
      },
      {
        id: "cursor-terminal",
        title: "Cursor Terminal",
        registryPath: "registry/new-york/blocks/cursor-terminal",
      },
      {
        id: "event-stream",
        title: "Event Stream",
        registryPath: "registry/new-york/blocks/event-stream",
      },
    ],
  },
  {
    id: "how-it-works",
    title: "How it works",
    description: "Process sections that explain steps, flows, and timelines.",
    versions: [],
  },
  {
    id: "value-proposition",
    title: "Value proposition",
    description: "Messaging blocks that clarify outcomes, benefits, and differentiation.",
    versions: [],
  },
  {
    id: "case-study",
    title: "Case study",
    description: "Narrative sections with context, results, and proof points.",
    versions: [],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Customer quotes, reviews, and social proof.",
    versions: [],
  },
  {
    id: "stats",
    title: "Stats",
    description: "Metrics, numbers, and achievement highlights.",
    versions: [],
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Pricing tables and plan comparison layouts.",
    versions: [],
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Frequently asked questions with accordion layouts.",
    versions: [],
  },
  {
    id: "cta",
    title: "CTA",
    description: "Call-to-action banners and conversion sections.",
    versions: [],
  },
  {
    id: "about-us",
    title: "About us",
    description: "Company story, mission, and positioning sections.",
    versions: [],
  },
  {
    id: "resources",
    title: "Resources",
    description: "Link grids for docs, guides, downloads, and learning material.",
    versions: [],
  },
  {
    id: "footer",
    title: "Footer",
    description: "Site footer layouts with links and branding.",
    versions: [],
  },
]

export function getBlockCategoryById(id: string) {
  return blockCategories.find((category) => category.id === id)
}
