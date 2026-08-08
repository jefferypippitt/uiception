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
  | "changelog"
  | "team"
  | "contact"
  | "blog"
  | "gallery"
  | "video"
  | "timeline"
  | "comparison"
  | "newsletter"
  | "waitlist"
  | "social-proof"
  | "partners"
  | "backgrounds"
  | "sidebar"
  | "banner"
  | "mockups"

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
    versions: [
      {
        id: "navbar-section-v1",
        title: "Navbar Section v1",
        registryPath: "registry/new-york/blocks/navbar-section-v1",
      },
      {
        id: "navbar-section-v2",
        title: "Navbar Section v2",
        registryPath: "registry/new-york/blocks/navbar-section-v2",
      },
      {
        id: "navbar-section-v3",
        title: "Navbar Section v3",
        registryPath: "registry/new-york/blocks/navbar-section-v3",
      },
      {
        id: "navbar-section-v4",
        title: "Navbar Section v4",
        registryPath: "registry/new-york/blocks/navbar-section-v4",
      },
      {
        id: "navbar-section-v5",
        title: "Navbar Section v5",
        registryPath: "registry/new-york/blocks/navbar-section-v5",
      },
      {
        id: "navbar-section-v6",
        title: "Navbar Section v6",
        registryPath: "registry/new-york/blocks/navbar-section-v6",
      },
      {
        id: "navbar-section-v7",
        title: "Navbar Section v7",
        registryPath: "registry/new-york/blocks/navbar-section-v7",
      },
      {
        id: "navbar-section-v8",
        title: "Navbar Section v8",
        registryPath: "registry/new-york/blocks/navbar-section-v8",
      },
      {
        id: "navbar-section-v9",
        title: "Navbar Section v9",
        registryPath: "registry/new-york/blocks/navbar-section-v9",
      },
      {
        id: "navbar-section-v10",
        title: "Navbar Section v10",
        registryPath: "registry/new-york/blocks/navbar-section-v10",
      },
    ],
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
      {
        id: "hero-section-v5",
        title: "Hero Section v5",
        registryPath: "registry/new-york/blocks/hero-section-v5",
      },
      {
        id: "hero-section-v6",
        title: "Hero Section v6",
        registryPath: "registry/new-york/blocks/hero-section-v6",
      },
      {
        id: "hero-section-v7",
        title: "Hero Section v7",
        registryPath: "registry/new-york/blocks/hero-section-v7",
      },
      {
        id: "hero-section-v8",
        title: "Hero Section v8",
        registryPath: "registry/new-york/blocks/hero-section-v8",
      },
      {
        id: "hero-section-v9",
        title: "Hero Section v9",
        registryPath: "registry/new-york/blocks/hero-section-v9",
      },
      {
        id: "hero-section-v10",
        title: "Hero Section v10",
        registryPath: "registry/new-york/blocks/hero-section-v10",
      },
      {
        id: "hero-section-v11",
        title: "Hero Section v11",
        registryPath: "registry/new-york/blocks/hero-section-v11",
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
      {
        id: "brands-section-v3",
        title: "Brands Section v3",
        registryPath: "registry/new-york/blocks/brands-section-v3",
      },
      {
        id: "brands-section-v4",
        title: "Brands Section v4",
        registryPath: "registry/new-york/blocks/brands-section-v4",
      },
      {
        id: "brands-section-v5",
        title: "Brands Section v5",
        registryPath: "registry/new-york/blocks/brands-section-v5",
      },
      {
        id: "brands-section-v6",
        title: "Brands Section v6",
        registryPath: "registry/new-york/blocks/brands-section-v6",
      },
      {
        id: "brands-section-v7",
        title: "Brands Section v7",
        registryPath: "registry/new-york/blocks/brands-section-v7",
      },
      {
        id: "brands-section-v8",
        title: "Brands Section v8",
        registryPath: "registry/new-york/blocks/brands-section-v8",
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
      {
        id: "feature-section-v2",
        title: "Feature Section v2",
        registryPath: "registry/new-york/blocks/feature-section-v2",
      },
      {
        id: "feature-section-v3",
        title: "Feature Section v3",
        registryPath: "registry/new-york/blocks/feature-section-v3",
      },
      {
        id: "feature-section-v4",
        title: "Feature Section v4",
        registryPath: "registry/new-york/blocks/feature-section-v4",
      },
      {
        id: "feature-section-v5",
        title: "Feature Section v5",
        registryPath: "registry/new-york/blocks/feature-section-v5",
      },
      {
        id: "feature-section-v6",
        title: "Feature Section v6",
        registryPath: "registry/new-york/blocks/feature-section-v6",
      },
      {
        id: "feature-section-v7",
        title: "Feature Section v7",
        registryPath: "registry/new-york/blocks/feature-section-v7",
      },
      {
        id: "feature-section-v8",
        title: "Feature Section v8",
        registryPath: "registry/new-york/blocks/feature-section-v8",
      },
      {
        id: "feature-section-v9",
        title: "Feature Section v9",
        registryPath: "registry/new-york/blocks/feature-section-v9",
      },
      {
        id: "feature-section-v10",
        title: "Feature Section v10",
        registryPath: "registry/new-york/blocks/feature-section-v10",
      },
      {
        id: "feature-section-v11",
        title: "Feature Section v11",
        registryPath: "registry/new-york/blocks/feature-section-v11",
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
      {
        id: "code-block",
        title: "Code Block",
        registryPath: "registry/new-york/blocks/code-block",
      },
    ],
  },
  {
    id: "how-it-works",
    title: "How it works",
    description: "Process sections that explain steps, flows, and timelines.",
    versions: [
      {
        id: "how-it-works-section-v1",
        title: "How It Works Section v1",
        registryPath: "registry/new-york/blocks/how-it-works-section-v1",
      },
      {
        id: "how-it-works-section-v2",
        title: "How It Works Section v2",
        registryPath: "registry/new-york/blocks/how-it-works-section-v2",
      },
    ],
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
    versions: [
      {
        id: "testimonials-section-v1",
        title: "Testimonials Section v1",
        registryPath: "registry/new-york/blocks/testimonials-section-v1",
      },
      {
        id: "testimonials-section-v2",
        title: "Testimonials Section v2",
        registryPath: "registry/new-york/blocks/testimonials-section-v2",
      },
      {
        id: "testimonials-section-v3",
        title: "Testimonials Section v3",
        registryPath: "registry/new-york/blocks/testimonials-section-v3",
      },
      {
        id: "testimonials-section-v4",
        title: "Testimonials Section v4",
        registryPath: "registry/new-york/blocks/testimonials-section-v4",
      },
    ],
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
      {
        id: "stats-section-v2",
        title: "Stats Section v2",
        registryPath: "registry/new-york/blocks/stats-section-v2",
      },
      {
        id: "stats-section-v3",
        title: "Stats Section v3",
        registryPath: "registry/new-york/blocks/stats-section-v3",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Pricing tables and plan comparison layouts.",
    versions: [
      {
        id: "pricing-section-v1",
        title: "Pricing Section v1",
        registryPath: "registry/new-york/blocks/pricing-section-v1",
      },
      {
        id: "pricing-section-v2",
        title: "Pricing Section v2",
        registryPath: "registry/new-york/blocks/pricing-section-v2",
      },
      {
        id: "pricing-section-v3",
        title: "Pricing Section v3",
        registryPath: "registry/new-york/blocks/pricing-section-v3",
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Frequently asked questions with accordion layouts.",
    versions: [
      {
        id: "faq-section-v1",
        title: "FAQ Section v1",
        registryPath: "registry/new-york/blocks/faq-section-v1",
      },
      {
        id: "faq-section-v2",
        title: "FAQ Section v2",
        registryPath: "registry/new-york/blocks/faq-section-v2",
      },
      {
        id: "faq-section-v3",
        title: "FAQ Section v3",
        registryPath: "registry/new-york/blocks/faq-section-v3",
      },
      {
        id: "faq-section-v4",
        title: "FAQ Section v4",
        registryPath: "registry/new-york/blocks/faq-section-v4",
      },
    ],
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
      {
        id: "cta-section-v3",
        title: "CTA Section v3",
        registryPath: "registry/new-york/blocks/cta-section-v3",
      },
      {
        id: "cta-section-v4",
        title: "CTA Section v4",
        registryPath: "registry/new-york/blocks/cta-section-v4",
      },
      {
        id: "cta-section-v5",
        title: "CTA Section v5",
        registryPath: "registry/new-york/blocks/cta-section-v5",
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
      {
        id: "footer-section-v2",
        title: "Footer Section v2",
        registryPath: "registry/new-york/blocks/footer-section-v2",
      },
      {
        id: "footer-section-v3",
        title: "Footer Section v3",
        registryPath: "registry/new-york/blocks/footer-section-v3",
      },
    ],
  },
  {
    id: "changelog",
    title: "Changelog",
    description: "Release notes and update sections with dated entries.",
    versions: [
      {
        id: "changelog-section-v1",
        title: "Changelog Section v1",
        registryPath: "registry/new-york/blocks/changelog-section-v1",
      },
    ],
  },
  {
    id: "team",
    title: "Team",
    description: "Team member grids, bios, and org structures.",
    versions: [],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Contact forms, maps, and support entry points.",
    versions: [],
  },
  {
    id: "blog",
    title: "Blog",
    description: "Article grids, featured posts, and editorial layouts.",
    versions: [],
  },
  {
    id: "gallery",
    title: "Gallery",
    description: "Image and media grids with lightbox and masonry layouts.",
    versions: [
      {
        id: "gallery-section-v1",
        title: "Gallery Section v1",
        registryPath: "registry/new-york/blocks/gallery-section-v1",
      },
      {
        id: "gallery-section-v2",
        title: "Gallery Section v2",
        registryPath: "registry/new-york/blocks/gallery-section-v2",
      },
      {
        id: "gallery-section-v3",
        title: "Gallery Section v3",
        registryPath: "registry/new-york/blocks/gallery-section-v3",
      },
    ],
  },
  {
    id: "video",
    title: "Video",
    description: "Video embeds, players, and media-forward hero sections.",
    versions: [],
  },
  {
    id: "timeline",
    title: "Timeline",
    description: "Chronological event and milestone sections.",
    versions: [],
  },
  {
    id: "comparison",
    title: "Comparison",
    description: "Side-by-side feature and plan comparison tables.",
    versions: [],
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Email capture and subscription sections.",
    versions: [],
  },
  {
    id: "waitlist",
    title: "Waitlist",
    description: "Pre-launch signup and early access capture sections.",
    versions: [],
  },
  {
    id: "social-proof",
    title: "Social Proof",
    description: "Press logos, awards, and third-party validation sections.",
    versions: [],
  },
  {
    id: "partners",
    title: "Partners",
    description: "Partner, investor, and ecosystem logo grids.",
    versions: [],
  },
  {
    id: "backgrounds",
    title: "Backgrounds",
    description: "Decorative background patterns, gradients, and canvas effects.",
    versions: [],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    description: "Side navigation panels, drawers, and collapsible menus.",
    versions: [],
  },
  {
    id: "banner",
    title: "Banner",
    description: "Promotional banners, announcement bars, and cookie consent strips.",
    versions: [],
  },
  {
    id: "mockups",
    title: "Mockups",
    description:
      "Wireframe-style UI chrome—browsers, devices, and app shells for product demos.",
    versions: [
      {
        id: "spreadsheet",
        title: "Spreadsheet",
        registryPath: "registry/new-york/blocks/spreadsheet",
      },
      {
        id: "google-chrome-with-image",
        title: "Google Chrome (macOS, w/ image)",
        registryPath: "registry/new-york/blocks/google-chrome-with-image",
      },
      {
        id: "google-chrome-with-video",
        title: "Google Chrome (macOS, w/ video)",
        registryPath: "registry/new-york/blocks/google-chrome-with-video",
      },
      {
        id: "google-chrome-windows-with-image",
        title: "Google Chrome (Windows, w/ image)",
        registryPath: "registry/new-york/blocks/google-chrome-windows-with-image",
      },
      {
        id: "google-chrome-windows-with-video",
        title: "Google Chrome (Windows, w/ video)",
        registryPath: "registry/new-york/blocks/google-chrome-windows-with-video",
      },
      {
        id: "macbook-pro-with-image",
        title: "MacBook Pro (w/ image)",
        registryPath: "registry/new-york/blocks/macbook-pro-with-image",
      },
      {
        id: "macbook-pro-with-video",
        title: "MacBook Pro (w/ video)",
        registryPath: "registry/new-york/blocks/macbook-pro-with-video",
      },
      {
        id: "mac-studio-display-with-image",
        title: "Mac Studio Display (w/ image)",
        registryPath: "registry/new-york/blocks/mac-studio-display-with-image",
      },
      {
        id: "mac-studio-display-with-video",
        title: "Mac Studio Display (w/ video)",
        registryPath: "registry/new-york/blocks/mac-studio-display-with-video",
      },
      {
        id: "iphone-17-pro-max-with-image",
        title: "iPhone 17 Pro Max (w/ image)",
        registryPath: "registry/new-york/blocks/iphone-17-pro-max-with-image",
      },
      {
        id: "iphone-17-pro-max-with-video",
        title: "iPhone 17 Pro Max (w/ video)",
        registryPath: "registry/new-york/blocks/iphone-17-pro-max-with-video",
      },
    ],
  },
]

export function getBlockCategoryById(id: string) {
  return blockCategories.find((category) => category.id === id)
}
