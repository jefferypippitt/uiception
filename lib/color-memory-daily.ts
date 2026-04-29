const DEFAULT_TIME_ZONE = "UTC"
const EPOCH = new Date(Date.UTC(2021, 5, 19))

export type ColorMemoryHsb = {
  h: number
  s: number
  b: number
}

export type ColorMemoryTodayMeta = {
  dayKey: string
  puzzleNumber: number
  colors: ColorMemoryHsb[]
}

function resolveTimeZone(timeZone?: string): string {
  const tz = (timeZone ?? "").trim()
  if (!tz) return DEFAULT_TIME_ZONE
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date())
    return tz
  } catch {
    return DEFAULT_TIME_ZONE
  }
}

function dayPartsInTimeZone(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  return {
    year: Number(parts.find((p) => p.type === "year")?.value ?? NaN),
    month: Number(parts.find((p) => p.type === "month")?.value ?? NaN),
    day: Number(parts.find((p) => p.type === "day")?.value ?? NaN),
  }
}

function dayKeyForTimeZone(date: Date, timeZone: string): string {
  const { year, month, day } = dayPartsInTimeZone(date, timeZone)
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function puzzleNumberForTimeZone(date: Date, timeZone: string): number {
  const { year, month, day } = dayPartsInTimeZone(date, timeZone)
  const dayStart = new Date(Date.UTC(year, month - 1, day))
  return Math.round((dayStart.getTime() - EPOCH.getTime()) / 86400000) + 1
}

function xmur3(seedText: string): () => number {
  let h = 1779033703 ^ seedText.length
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomIntInRange(nextFloat: () => number, min: number, max: number): number {
  return Math.floor(nextFloat() * (max - min + 1)) + min
}

export function dailyColorsForPuzzleNumber(
  puzzleNumber: number,
  dayKey: string,
  count: number
): ColorMemoryHsb[] {
  const seedText = `color-memory:${puzzleNumber}:${dayKey}`
  const toSeed = xmur3(seedText)
  const random = mulberry32(toSeed())

  return Array.from({ length: count }, () => ({
    h: randomIntInRange(random, 0, 359),
    s: randomIntInRange(random, 35, 95),
    b: randomIntInRange(random, 20, 90),
  }))
}

export function getColorMemoryTodayMeta(timeZone?: string): ColorMemoryTodayMeta {
  const now = new Date()
  const tz = resolveTimeZone(timeZone)
  const dayKey = dayKeyForTimeZone(now, tz)
  const puzzleNumber = puzzleNumberForTimeZone(now, tz)

  return {
    dayKey,
    puzzleNumber,
    colors: dailyColorsForPuzzleNumber(puzzleNumber, dayKey, 5),
  }
}
