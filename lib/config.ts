const links = {
  twitter: "https://twitter.com/jefferypippitt",
  github: "https://github.com/jefferypippitt",
} as const

export const siteConfig = {
  name: "uiception",
  url: "https://uiception.com",
  ogImage: "https://uiception.com/uiception_logo_og.png",
  headline: "Skip to the good part\nof every project.",
  description:
    "Start with everything built. Install it all with one command, then make it yours.",
  metaDescription:
    "UI blocks and page templates for Next.js: hero sections, pricing tables, portfolios, landing pages, and more. Built with shadcn/ui and Tailwind CSS.",
  keywords: [
    "uiception",
    "UI blocks",
    "Next.js UI components",
    "shadcn/ui blocks",
    "landing page sections",
    "copy paste UI",
    "hero section",
    "navbar component",
    "pricing table",
    "CTA section",
    "React components",
    "Tailwind CSS",
    "website templates",
    "Next.js templates",
    "portfolio template",
    "landing page template",
    "Next.js",
    "shadcn",
  ],
  author: {
    name: "Jeffery Pippitt",
    url: links.github,
  },
  links,
  navItems: [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/blocks",
      label: "Blocks",
    },
    {
      href: "/templates",
      label: "Templates",
    },
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/changelog",
      label: "Changelog",
    },
  ],
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}