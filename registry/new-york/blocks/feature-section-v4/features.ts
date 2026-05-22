export type FeatureDefinition = {
  id: "cognitive-ai" | "global-reach" | "limitless-growth"
  labelPrimary: string
  labelSecondary: string
  title: string
  points: [string, string]
}

export const featureSectionItems: FeatureDefinition[] = [
  {
    id: "cognitive-ai",
    labelPrimary: "AI",
    labelSecondary: "Intelligence",
    title: "Cognitive AI Engine",
    points: ["Learns from every interaction", "Surfaces insights instantly"],
  },
  {
    id: "global-reach",
    labelPrimary: "Global",
    labelSecondary: "Scale",
    title: "Planetary-Scale Reach",
    points: ["Deploys across every region", "Connects teams worldwide"],
  },
  {
    id: "limitless-growth",
    labelPrimary: "Growth",
    labelSecondary: "Ambition",
    title: "Reach Beyond Limits",
    points: ["Built for what's next", "Grows with your vision"],
  },
]
