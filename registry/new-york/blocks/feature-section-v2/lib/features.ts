export type Feature = {
  id: string
  title: string
  description: string
}

export const features: Feature[] = [
  {
    id: "workflow-automation",
    title: "Workflow automation",
    description:
      "Set it up once and let it run. Your team gets back the time that used to disappear into repetitive work.",
  },
  {
    id: "real-time-analytics",
    title: "Real-time analytics",
    description:
      "Pull live data into your dashboards so you can act on it while it still matters, not days later when the weekly export finally lands.",
  },
  {
    id: "access-control",
    title: "Access control",
    description:
      "Give people exactly the access they need, keep sensitive areas locked down, and put an end to the permission requests piling up in your inbox.",
  },
  {
    id: "integrations",
    title: "Integrations",
    description:
      "Connect the tools your team already uses in minutes, without turning it into another engineering project.",
  },
]
