export type FeatureDefinition = {
  id: string
  title: string
  description: string
}

export const featureSectionItems: FeatureDefinition[] = [
  {
    id: "signal-over-noise",
    title: "Clear priorities",
    description: "The right updates reach the right people. Nothing else gets in the way.",
  },
  {
    id: "defaults-that-hold",
    title: "Smart defaults",
    description: "Sensible choices from day one so your team can move without second guessing.",
  },
  {
    id: "one-thread-per-outcome",
    title: "Shared context",
    description: "Decisions, files, and feedback stay with the work. No hunting across tools.",
  },
  {
    id: "quiet-reliability",
    title: "Quiet reliability",
    description: "When something needs attention, you get a clear signal and a path to fix it.",
  },
]
