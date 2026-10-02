export const caseStudy = {
  title: "One identity system for Acme's twelve products.",
  summary:
    "Separate teams built Acme's products, and by last year they used four logo variants and nine type scales. We replaced them with one mark and a shared set of design tokens that every team now uses.",
  imageFile: "image-1.jpg",
  alt: "A brand mark on a soft gray background surrounded by paper shapes",
} as const

export type MetricChart =
  /** Cumulative count that steps up once per period. */
  | { type: "steps"; values: number[]; ticks: string[] }
  /** Remaining work per period against a straight-line plan to zero. */
  | { type: "burndown"; values: number[]; ticks: string[] }
  /** Stage durations in days, before and after, drawn as segmented bars. */
  | {
      type: "timeline"
      rows: { label: string; stages: number[] }[]
      ticks: number[]
    }

export type Metric = {
  id: string
  value: string
  label: string
  chart: MetricChart
}

export const metrics: Metric[] = [
  {
    id: "teams",
    value: "14",
    label: "Teams moved over in a year",
    chart: {
      type: "steps",
      values: [2, 3, 3, 5, 6, 8, 9, 11, 12, 14],
      ticks: ["Q1", "Q2", "Q3", "Q4"],
    },
  },
  {
    id: "assets",
    value: "340+",
    label: "Old brand assets retired in 12 weeks",
    chart: {
      type: "burndown",
      values: [352, 349, 341, 322, 297, 251, 196, 140, 88, 47, 24, 12],
      ticks: ["Wk 1", "Wk 12"],
    },
  },
  {
    id: "handoff",
    value: "3 days",
    label: "From design to code, down from 11",
    chart: {
      type: "timeline",
      rows: [
        { label: "Before", stages: [4, 3, 4] },
        { label: "Now", stages: [1, 1, 1] },
      ],
      ticks: [0, 5, 10],
    },
  },
]
