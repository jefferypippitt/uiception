import { createBlockImage } from "@/lib/block-media"

const blockAvatar = createBlockImage("testimonials-section-v5")

export type Testimonial = {
  id: string
  quote: string
  name: string
  initials: string
  avatarSrc: string
}

export const sectionMeta = {
  badge: "Customer Stories",
  title: "Our Wall of Love",
  description:
    "Read what our talented community members are saying about Acme",
}

export const testimonials: Testimonial[] = [
  {
    id: "will-barron",
    quote:
      "A hiring manager found my profile on Acme while searching for local designers. She reached out directly, and after one quick call I had an offer before the week was out.",
    name: "Will Barron",
    initials: "WB",
    avatarSrc: blockAvatar("avatar-2.png"),
  },
  {
    id: "priya-nair",
    quote: "Acme completely changed how our team collaborates. Simple as that.",
    name: "Priya Nair",
    initials: "PN",
    avatarSrc: blockAvatar("avatar-1.png"),
  },
  {
    id: "marcus-webb",
    quote:
      "I joined Acme mostly to get feedback on side projects, but ended up landing three freelance clients within my first month. The critique threads alone are worth more than most paid courses I've taken, and people actually follow up to see how your work turned out.",
    name: "Marcus Webb",
    initials: "MW",
    avatarSrc: blockAvatar("avatar-4.png"),
  },
  {
    id: "elena-ross",
    quote: "Best design community I've found online. Full stop.",
    name: "Elena Ross",
    initials: "ER",
    avatarSrc: blockAvatar("avatar-5.png"),
  },
  {
    id: "daniel-park",
    quote:
      "I posted my portfolio on Acme on a whim and within a week had a recruiter reach out about a role I wasn't even actively looking for. Wouldn't have happened anywhere else.",
    name: "Daniel Park",
    initials: "DP",
    avatarSrc: blockAvatar("avatar-6.png"),
  },
  {
    id: "grace-kim",
    quote:
      "What keeps me coming back to Acme is how generous everyone is with their time. I've had senior designers walk me through their entire process just because I asked a question in the comments. That kind of mentorship is rare, and it's the reason I've stuck around for three years now.",
    name: "Grace Kim",
    initials: "GK",
    avatarSrc: blockAvatar("avatar-3.png"),
  },
]
