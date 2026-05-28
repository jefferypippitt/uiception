export type FeatureIllustrationId =
  | "workflow-automation"
  | "real-time-analytics"
  | "access-control"
  | "integrations"

export const featureIllustrationViewBoxes = {
  "workflow-automation": "16 20 456 342",
  "real-time-analytics": "24 28 440 318",
  "access-control": "32 24 396 294",
  integrations: "20 16 448 348",
} as const satisfies Record<FeatureIllustrationId, string>

export type Feature = {
  id: string
  title: string
  description: string
  illustration: FeatureIllustrationId
}

export const features: Feature[] = [
  {
    id: "workflow-automation",
    title: "Workflow automation",
    description:
      "Set it up once and let it run. Your team gets back the time that used to disappear into repetitive work.",
    illustration: "workflow-automation",
  },
  {
    id: "real-time-analytics",
    title: "Real-time analytics",
    description:
      "Pull live data into your dashboards so you can act on it while it still matters, not days later when the weekly export finally lands.",
    illustration: "real-time-analytics",
  },
  {
    id: "access-control",
    title: "Access control",
    description:
      "Give people exactly the access they need, keep sensitive areas locked down, and put an end to the permission requests piling up in your inbox.",
    illustration: "access-control",
  },
  {
    id: "integrations",
    title: "Integrations",
    description:
      "Connect the tools your team already uses in minutes, without turning it into another engineering project.",
    illustration: "integrations",
  },
]
