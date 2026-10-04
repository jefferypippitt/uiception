export const partnersSectionV2Content = {
  heading: "We work with the companies developers build on",
  description:
    "Our partners make the tools developers use to write code and run it in production.",
} as const

/** Number of logo cells in the grid. Each cell rotates through `partners.length / CELL_COUNT` logos. */
export const CELL_COUNT = 6

export const motion = {
  /** Pause between one cell swap and the next (seconds). */
  swapInterval: 1.6,
  /** Duration of a single logo swap (seconds). */
  swapDuration: 0.7,
} as const
