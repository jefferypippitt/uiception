import { cache } from "react"

import type { BrandConfig, SeriesData, SeriesId } from "./series"

// 18 months of daily data aggregated into ~24 monthly buckets.
// Monthly smoothing removes week-to-week noise so growth curves
// read clearly upward for any package that has been growing.
const BUCKET_DAYS = 23 // ~18 months / 24 buckets

const GH_HEADERS = { Accept: "application/vnd.github+json" }
const REVALIDATE = { next: { revalidate: 86400 } } as const

async function fetchNpmRange(id: SeriesId, pkg: string) {
  const end = new Date().toISOString().split("T")[0]
  const start = new Date(Date.now() - 548 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]

  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/range/${start}:${end}/${encodeURIComponent(pkg)}`,
      REVALIDATE
    )
    if (!res.ok) return { id, points: [] as { i: number; v: number }[] }

    const json = await res.json()
    const daily: { day: string; downloads: number }[] = json.downloads ?? []

    // Convert periodic buckets to running cumulative sum so the chart is
    // always monotonically increasing.
    let cumulative = 0
    const points: { i: number; v: number }[] = []
    for (let i = 0; i < daily.length; i += BUCKET_DAYS) {
      const bucket = daily.slice(i, i + BUCKET_DAYS)
      cumulative += bucket.reduce((acc, d) => acc + d.downloads, 0)
      points.push({ i: points.length, v: cumulative })
    }

    return { id, points }
  } catch {
    return { id, points: [] as { i: number; v: number }[] }
  }
}

async function fetchNpmTotal(pkg: string): Promise<number> {
  const end = new Date().toISOString().split("T")[0]
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/2015-01-10:${end}/${encodeURIComponent(pkg)}`,
      REVALIDATE
    )
    if (!res.ok) return 0
    const json = await res.json()
    return (json.downloads as number) ?? 0
  } catch {
    return 0
  }
}

async function fetchNpmWeekly(pkg: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
      REVALIDATE
    )
    if (!res.ok) return 0
    const json = await res.json()
    return (json.downloads as number) ?? 0
  } catch {
    return 0
  }
}

async function fetchGitHub(
  repo: string
): Promise<{ stars: number; contributors: number }> {
  try {
    const [repoRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        headers: GH_HEADERS,
        ...REVALIDATE,
      }),
      fetch(
        `https://api.github.com/repos/${repo}/contributors?per_page=1&anon=1`,
        { headers: GH_HEADERS, ...REVALIDATE }
      ),
    ])

    const stars = repoRes.ok
      ? ((await repoRes.json()).stargazers_count as number) ?? 0
      : 0

    let contributors = 0
    if (contribRes.ok) {
      const link = contribRes.headers.get("Link") ?? ""
      const match = link.match(/page=(\d+)>;\s*rel="last"/)
      contributors = match ? parseInt(match[1], 10) : 1
    }

    return { stars, contributors }
  } catch {
    return { stars: 0, contributors: 0 }
  }
}

export const getSeriesData = cache(
  async (brand: BrandConfig): Promise<SeriesData> => {
    const [npmRange, total, weeklyDownloads, github] = await Promise.all([
      fetchNpmRange(brand.id, brand.npmPackage),
      fetchNpmTotal(brand.npmPackage),
      fetchNpmWeekly(brand.npmPackage),
      fetchGitHub(brand.githubRepo),
    ])

    return {
      id: brand.id,
      total,
      weeklyDownloads,
      stars: github.stars,
      contributors: github.contributors,
      points: npmRange.points,
    }
  }
)
