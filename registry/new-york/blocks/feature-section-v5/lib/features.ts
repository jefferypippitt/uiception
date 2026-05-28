export type FeatureDefinition = {
  id: string
  title: string
  description: string
}

export const featureSectionItems: FeatureDefinition[] = [
  {
    id: "signal-over-noise",
    title: "Surface the signal",
    description:
      "Stay on top of what matters without drowning in noise. The right updates reach the right people automatically.",
  },
  {
    id: "defaults-that-hold",
    title: "Guardrails that scale",
    description:
      "Sensible defaults ship on day one. Your team moves fast while the product stays consistent as you grow.",
  },
  {
    id: "one-thread-per-outcome",
    title: "Context travels with it",
    description:
      "Every task carries its own history. Decisions, files, and feedback stay attached to the work so nothing falls through the cracks.",
  },
  {
    id: "quiet-reliability",
    title: "Reliable by default",
    description:
      "Consistent behavior under pressure. When something needs attention you get a clear signal and a straight path to resolve it.",
  },
]
