const blockAvatar = (filename: string) =>
  `https://uiception.com/images/blocks/testimonials-section-v1/${filename}`

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  company: string
  initials: string
  avatarSrc: string
}

export const sectionMeta = {
  title: "Our Clients",
}

export const testimonials: Testimonial[] = [
  {
    id: "ethan-morrison",
    quote:
      "We rolled out the platform in three weeks. Setup was simple and our team was productive from day one.",
    name: "Ethan Morrison",
    role: "CEO",
    company: "Veldt Analytics",
    initials: "EM",
    avatarSrc: blockAvatar("avatar-2.png"),
  },
  {
    id: "claire-donovan",
    quote:
      "Security review went smoothly. Permissions, audit logs, and data controls were exactly what our team needed.",
    name: "Claire Donovan",
    role: "VP Engineering",
    company: "Brindle Field Co.",
    initials: "CD",
    avatarSrc: blockAvatar("avatar-1.png"),
  },
  {
    id: "jordan-ellis",
    quote:
      "Everything stays in sync across our tools. We finally have one place the whole team trusts for daily work.",
    name: "Jordan Ellis",
    role: "Staff Engineer",
    company: "Patchwork Fleet",
    initials: "JE",
    avatarSrc: blockAvatar("avatar-4.png"),
  },
  {
    id: "mei-lin-chen",
    quote:
      "We cut weekly reporting time in half. The product is intuitive enough that new hires picked it up without extra training.",
    name: "Mei Lin Chen",
    role: "Head of Platform",
    company: "Omniform Studio",
    initials: "MC",
    avatarSrc: blockAvatar("avatar-3.png"),
  },
  {
    id: "ryan-park",
    quote:
      "We went live in one sprint. The trial let us validate our workflow before committing the whole company.",
    name: "Ryan Park",
    role: "Founding Engineer",
    company: "Grainline Ops",
    initials: "RP",
    avatarSrc: blockAvatar("avatar-6.png"),
  },
  {
    id: "hannah-bergstrom",
    quote:
      "Our support queue cleared faster once we centralized replies and history in one inbox. Escalations dropped within the first month.",
    name: "Hannah Bergstrom",
    role: "Director of Product",
    company: "Westward Ledger",
    initials: "HB",
    avatarSrc: blockAvatar("avatar-5.png"),
  },
]
