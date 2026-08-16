export const HEADING = "What is Acme?"

export const PARAGRAPHS = [
  "Acme is an AI operations platform for engineering teams. It pairs an autonomous agent layer with workflow tools so ops work costs less time and focus.",
  "Companies like Nimbus, Fractal, and Lumen use Acme to automate deployments, monitoring, and incident response. They resolve incidents 6x faster and cut on-call hours in half.",
] as const

export type AboutFeature = {
  id: string
  title: string
  description: string
}

export const FEATURES: AboutFeature[] = [
  {
    id: "autonomous",
    title: "Autonomous by default",
    description:
      "AI agents triage alerts, patch known failure modes, and hand off only what actually needs a human.",
  },
  {
    id: "scale",
    title: "One control plane",
    description:
      "Keeps pace with millions of events without adding headcount.",
  },
]

export type AboutStat = {
  id: string
  value: string
  label: string
}

export const STATS: AboutStat[] = [
  {
    id: "teams",
    value: "12,000+",
    label: "Teams using Acme",
  },
  {
    id: "saved",
    value: "$40M+",
    label: "Saved in engineering time",
  },
  {
    id: "resolved",
    value: "6M+",
    label: "Incidents auto-resolved",
  },
]
