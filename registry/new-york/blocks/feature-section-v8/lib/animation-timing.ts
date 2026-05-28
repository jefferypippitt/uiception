import { hashString } from "./build-feature-preview"

export function elementDelay(seed: string, min = 0, max = 900): number {
  const span = max - min + 1
  return min + (hashString(seed) % span)
}

export function elementDuration(seed: string, min = 450, max = 1300): number {
  const span = max - min + 1
  return min + (hashString(seed) % span)
}

export function tickIntervalMs(instanceId: string, base = 2400, spread = 1000): number {
  const offset = (hashString(`${instanceId}-tick`) % spread) - spread / 2
  return Math.round(base + offset)
}

export function tickInitialDelayMs(instanceId: string, max = 2800): number {
  return hashString(`${instanceId}-init`) % max
}

export function jitterIntervalMs(instanceId: string, min = 110, max = 320): number {
  const span = max - min + 1
  return min + (hashString(`${instanceId}-jitter`) % span)
}
