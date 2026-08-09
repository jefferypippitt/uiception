export type FooterLink = {
  label: string
  href: string
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Live monitoring", href: "#" },
      { label: "Incident response", href: "#" },
      { label: "Postmortems", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Video library", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
]

export const footerMeta = {
  name: "uiception",
  copyright: "Copyright © 2026 uiception. All rights reserved.",
  offices: "Offices in LA, NY, and Texas.",
}
