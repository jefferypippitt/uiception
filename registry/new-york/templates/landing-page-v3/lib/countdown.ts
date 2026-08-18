export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = 60 * MS_PER_SECOND
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const MS_PER_DAY = 24 * MS_PER_HOUR

export function remainingParts(target: Date | string, now: Date): CountdownParts {
  const end = typeof target === "string" ? new Date(target) : target
  const diff = Math.max(0, end.getTime() - now.getTime())

  const days = Math.floor(diff / MS_PER_DAY)
  const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR)
  const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE)
  const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND)

  return { days, hours, minutes, seconds }
}

export function padDigits(value: number, width = 2): string {
  return String(Math.max(0, Math.floor(value))).padStart(width, "0")
}
