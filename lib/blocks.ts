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
      {
        id: "hero-section-v3",
        title: "Hero Section v3",
        registryPath: "registry/new-york/blocks/hero-section-v3",
      },
      {
        id: "hero-section-v4",
        title: "Hero Section v4",
        registryPath: "registry/new-york/blocks/hero-section-v4",
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
    versions: [
      {
        id: "feature-section-v1",
        title: "Feature Section v1",
        registryPath: "registry/new-york/blocks/feature-section-v1",
      },
    ],
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
      {
        id: "chat-bot",
        title: "Chat Bot",
        registryPath: "registry/new-york/blocks/chat-bot",
      },
      {
        id: "simple-chatbot",
        title: "Simple Chatbot",
        registryPath: "registry/new-york/blocks/simple-chatbot",
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
    versions: [
      {
        id: "stats-section-v1",
        title: "Stats Section v1",
        registryPath: "registry/new-york/blocks/stats-section-v1",
      },
    ],
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
    versions: [
      {
        id: "cta-section-v1",
        title: "CTA Section v1",
        registryPath: "registry/new-york/blocks/cta-section-v1",
      },
      {
        id: "cta-section-v2",
        title: "CTA Section v2",
        registryPath: "registry/new-york/blocks/cta-section-v2",
      },
    ],
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
    versions: [
      {
        id: "footer-section-v1",
        title: "Footer Section v1",
        registryPath: "registry/new-york/blocks/footer-section-v1",
      },
    ],
  },
]

export function getBlockCategoryById(id: string) {
  return blockCategories.find((category) => category.id === id)
}
