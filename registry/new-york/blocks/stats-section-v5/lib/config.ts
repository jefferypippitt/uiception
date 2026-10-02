export const sectionHeader = {
  title: "Most requests finish faster than a blink.",
  subtitle:
    "We timed every request to Acme over the last 24 hours. 90% finished in under 100 ms, about one blink. Green bars finished faster than typical, amber bars took longer, and red bars are the slowest 1%.",
} as const

/** Width of one histogram bucket, in milliseconds. */
export const BUCKET_MS = 5
const BUCKETS = 48
const TOTAL_REQUESTS = 2_100_000_000

/** Log-normal latency: the median is e^MU, the spread is SIGMA. */
const MEDIAN_MS = 48
const MU = Math.log(MEDIAN_MS)
const SIGMA = 0.55
/** z-score of the 99th percentile of a standard normal distribution. */
const Z_99 = 2.326

export const P50_MS = MEDIAN_MS
export const P99_MS = Math.round(Math.exp(MU + Z_99 * SIGMA))

export type Band = "p50" | "p99" | "tail"

/**
 * Speed colors, green to red. Mid-tone oklch values so they read on both
 * light and dark backgrounds without a theme variable.
 */
export const BAND_COLORS: Record<Band, string> = {
  p50: "oklch(0.72 0.17 155)",
  p99: "oklch(0.78 0.16 75)",
  tail: "oklch(0.64 0.21 25)",
}

export type LatencyBucket = {
  /** Start of the bucket, in milliseconds. */
  ms: number
  requests: number
  band: Band
  /** Share of all requests, 0 to 100, that finish by the end of the bucket. */
  doneBy: number
}

/** Abramowitz and Stegun 7.1.26 approximation of the error function. */
function erf(x: number) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const poly =
    t *
    (0.254829592 +
      t *
        (-0.284496736 +
          t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const value = 1 - poly * Math.exp(-x * x)
  return x < 0 ? -value : value
}

function logNormalShareBy(ms: number) {
  const z = (Math.log(ms) - MU) / SIGMA
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

function logNormalDensity(ms: number) {
  const x = Math.max(ms, 0.5)
  const z = (Math.log(x) - MU) / SIGMA
  return Math.exp(-0.5 * z * z) / (x * SIGMA * Math.sqrt(2 * Math.PI))
}

function bandFor(ms: number): Band {
  if (ms < P50_MS) return "p50"
  if (ms < P99_MS) return "p99"
  return "tail"
}

/** Requests per bucket, drawn from the same curve that sets P50_MS and P99_MS. */
export const latencyBuckets: LatencyBucket[] = Array.from(
  { length: BUCKETS },
  (_, index) => {
    const ms = index * BUCKET_MS
    const center = ms + BUCKET_MS / 2
    return {
      ms,
      requests: Math.round(
        TOTAL_REQUESTS * logNormalDensity(center) * BUCKET_MS
      ),
      band: bandFor(ms),
      doneBy: logNormalShareBy(ms + BUCKET_MS) * 100,
    }
  }
)

/** Snaps a latency to the start of its bucket so it lines up with a bar. */
export function bucketOf(ms: number) {
  return Math.floor(ms / BUCKET_MS) * BUCKET_MS
}

export type Marker = "p50" | "p99"

/** The reference line a bucket belongs to: the median, or the 99th percentile past it. */
export function markerFor(band: Band): Marker {
  return band === "p50" ? "p50" : "p99"
}

export type Stat = {
  id: string
  value: string
  label: string
  /** Stats with a marker match a dashed reference line on the chart. */
  marker?: Marker
}

export const stats: Stat[] = [
  {
    id: "p50",
    value: `${P50_MS} ms`,
    label: "Typical response",
    marker: "p50",
  },
  {
    id: "p99",
    value: `${P99_MS} ms`,
    label: "99% under",
    marker: "p99",
  },
  { id: "requests", value: "2.1B", label: "Requests a day" },
  { id: "uptime", value: "99.99%", label: "Uptime" },
]
