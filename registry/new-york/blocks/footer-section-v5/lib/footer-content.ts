export type FooterLink = {
  label: string
  href: string
}

export type FooterSocialLink = {
  label: string
  href: string
  icon: "linkedin" | "x"
}

export const footerColumn = {
  title: "Company",
  links: [
    { label: "About us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ] satisfies FooterLink[],
}

export const footerSocial: FooterSocialLink[] = [
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "X", href: "#", icon: "x" },
]

export const footerLegal: FooterLink[] = [
  { label: "Terms of Use", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

export const footerMeta = {
  name: "uiception",
  copyright: "© 2026 uiception. All rights reserved",
}
