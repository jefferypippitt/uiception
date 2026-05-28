const links = {
  twitter: "https://twitter.com/jefferypippitt",
  github: "https://github.com/jefferypippitt",
} as const

export const siteConfig = {
  name: "uiception",
  url: "https://uiception.com",
  ogImage: "https://uiception.com/uiception_logo_og.png",
  description: "Launch with everything built. Just make it yours.",
  metaDescription:
    "Pre-built UI blocks for Next.js. Copy-paste hero sections, navbars, pricing tables, CTAs, and more. Built with shadcn/ui and Tailwind CSS.",
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
      href: "/blocks",
      label: "Blocks",
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