export type Feature = {
  id: "funnel-opportunities" | "dropoff-diagnosis" | "experiment-impact"
  step: string
  title: string
  description: string
}

export const features: Feature[] = [
  {
    id: "funnel-opportunities",
    step: "01",
    title: "Find opportunities hiding in your funnel",
    description:
      "Follows users through your funnel so gaps and odd behavior surface before they cost you.",
  },
  {
    id: "dropoff-diagnosis",
    step: "02",
    title: "Understand what's driving the drop-off",
    description:
      "Points to exactly where users stall in your flow and what's sending them away.",
  },
  {
    id: "experiment-impact",
    step: "03",
    title: "Growth experiments from insight to impact",
    description:
      "Transforms insights into real experiments and follows the results until you see impact.",
 
  },
]
