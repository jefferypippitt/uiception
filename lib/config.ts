const links = {
  twitter: "https://twitter.com/jefferypippitt",
  github: "https://github.com/jefferypippitt",
} as const

export const siteConfig = {
  name: "uiception",
  url: "https://uiception.com",
  ogImage: "https://uiception.com/icon_512x512.png",
  description:
    "Beautiful UI. Zero bloat. Copy and paste blocks. Ship today.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "UI components",
    "blocks",
    "shadcn",
    "uiception",
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