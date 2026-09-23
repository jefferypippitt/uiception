/** Same neutral gray as the Next.js series in stats-section-v2. */
export const CHART_COLOR = "#888888"

export const sectionHeader = {
  title: "Adoption that compounds.",
  subtitle: "Every block installed makes the next project faster to ship.",
} as const

export type Stat = {
  id: string
  value: string
  label: string
}

export const stats: Stat[] = [
  { id: "installs", value: "1.2M", label: "installs this week" },
  { id: "projects", value: "48k", label: "projects shipped" },
  { id: "blocks", value: "310", label: "blocks and templates" },
  { id: "countries", value: "140+", label: "countries building" },
]

export type WeekPoint = {
  week: number
  installs: number
}

const WEEKS = 180
const FINAL_INSTALLS = 1200
const START_INSTALLS = 18
/** Higher values keep the curve flat for longer before it bends upward. */
const GROWTH = 4.2

/**
 * Weekly installs, in thousands: flat at first, then compounding up to the
 * 1.2M "installs this week" stat in the final week.
 */
export const weeklyInstalls: WeekPoint[] = Array.from(
  { length: WEEKS },
  (_, index) => {
    const t = index / (WEEKS - 1)
    const curve = (Math.exp(GROWTH * t) - 1) / (Math.exp(GROWTH) - 1)
    return {
      week: index + 1,
      installs: Math.round(
        START_INSTALLS + (FINAL_INSTALLS - START_INSTALLS) * curve
      ),
    }
  }
)
