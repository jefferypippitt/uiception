export type FeatureIllustrationId =
  | "funnel-opportunities"
  | "dropoff-diagnosis"
  | "experiment-impact"

export type Feature = {
  id: FeatureIllustrationId
  step: string
  title: string
  description: string
  illustration: FeatureIllustrationId
}

export const features: Feature[] = [
  {
    id: "funnel-opportunities",
    step: "01",
    title: "Find opportunities hiding in your funnel",
    description:
      "Follows users through your funnel so gaps and odd behavior surface before they cost you.",
    illustration: "funnel-opportunities",
  },
  {
    id: "dropoff-diagnosis",
    step: "02",
    title: "Understand what's driving the drop-off",
    description:
      "Points to exactly where users stall in your flow and what's sending them away.",
    illustration: "dropoff-diagnosis",
  },
  {
    id: "experiment-impact",
    step: "03",
    title: "Growth experiments from insight to impact",
    description:
      "Transforms insights into real experiments and follows the results until you see impact.",
    illustration: "experiment-impact",
  },
]
