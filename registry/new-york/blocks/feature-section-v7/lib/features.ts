export type FeatureColumn = {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

export const featureColumns: FeatureColumn[] = [
  {
    id: "agents",
    title: "Give it a job to do",
    description:
      "You describe the outcome. The agent plans the work, reaches into your tools, and shows you every choice it made along the way.",
    ctaLabel: "See how agents work",
    ctaHref: "#",
  },
  {
    id: "knowledge",
    title: "Teach it what you know",
    description:
      "Point it at your docs, code, and data. Answers start sounding like your product, not like a model guessing in the dark.",
    ctaLabel: "Bring your sources",
    ctaHref: "#",
  },
  {
    id: "deploy",
    title: "Put it in front of people",
    description:
      "When it is ready, you ship behind one API. Latency, cost, and safety stay visible so the launch feels calm, not reckless.",
    ctaLabel: "Explore the platform",
    ctaHref: "#",
  },
]
