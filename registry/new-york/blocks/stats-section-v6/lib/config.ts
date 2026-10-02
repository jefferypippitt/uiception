export const sectionHeader = {
  title: "Most customers get an answer in under five minutes.",
  description:
    "We tracked the last 10,000 support requests to Acme. In each grid, one square is one customer out of 100.",
} as const

export type Group = {
  id: string
  /** Where the customer got their answer. */
  channel: string
  /** How long they waited for it. */
  wait: string
  /** Customers out of 100. The four shares add up to 100. */
  share: number
  /** One teal hue, lightest for the fastest answer. Reads on light and dark backgrounds. */
  color: string
}

export const groups: Group[] = [
  {
    id: "help-center",
    channel: "Help center",
    wait: "Instant",
    share: 64,
    color: "oklch(0.82 0.11 190)",
  },
  {
    id: "chat",
    channel: "Live chat",
    wait: "Under 5 minutes",
    share: 24,
    color: "oklch(0.68 0.12 195)",
  },
  {
    id: "email",
    channel: "Email",
    wait: "Same day",
    share: 9,
    color: "oklch(0.54 0.11 205)",
  },
  {
    id: "engineer",
    channel: "Engineer",
    wait: "Within 2 days",
    share: 3,
    color: "oklch(0.42 0.09 215)",
  },
]

export const GRID_SIZE = 10

/** One entry per square, filled row by row from the fastest group to the slowest. */
export const cells: number[] = groups.flatMap((group, groupIndex) =>
  Array.from({ length: group.share }, () => groupIndex)
)

/** Rows shown in the zoomed-in view for the smallest groups. */
export const ZOOM_ROWS = 2

/** The band of rows that holds a group's squares, kept inside the grid. */
export function zoomWindow(groupIndex: number) {
  const firstRow = Math.floor(cells.indexOf(groupIndex) / GRID_SIZE)
  return {
    start: Math.min(firstRow, GRID_SIZE - ZOOM_ROWS),
    count: ZOOM_ROWS,
  }
}

/** Each square's position within its own group, used to stagger animations. */
export const cellOrder: number[] = groups.flatMap((group) =>
  Array.from({ length: group.share }, (_, index) => index)
)
