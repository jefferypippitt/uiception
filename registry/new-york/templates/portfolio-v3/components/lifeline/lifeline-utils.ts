import type { LifelineMarker } from "./types"

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function snapToDevicePixel(value: number) {
  const dpr = window.devicePixelRatio || 1
  return Math.round(value * dpr) / dpr
}

export function hasMarkerContent(marker: LifelineMarker) {
  return (
    marker.events.length > 0 ||
    (marker.companies?.length ?? 0) > 0 ||
    (marker.met?.length ?? 0) > 0
  )
}

export function hasMarkerPeople(marker: LifelineMarker) {
  return (marker.met?.length ?? 0) > 0
}

function markerInlineMediaCount(marker: LifelineMarker) {
  return marker.events.filter(
    (event) =>
      typeof event === "object" &&
      !Array.isArray(event) &&
      Boolean(event.video || event.image),
  ).length
}

export function getMarkerHeight(marker: LifelineMarker, nextYear?: number) {
  const hasContent = hasMarkerContent(marker)
  const hasPeople = hasMarkerPeople(marker)

  if (!hasContent) return 48

  const peopleOnly =
    hasPeople &&
    marker.events.length === 0 &&
    (marker.companies?.length ?? 0) === 0

  let height = 96

  if (marker.companies?.length) height += 28
  height += marker.events.length * 44
  height += markerInlineMediaCount(marker) * 150

  if (peopleOnly) height += 88
  else if (hasPeople) height += 108

  if (!nextYear) return Math.min(560, Math.max(peopleOnly ? 148 : 188, height))

  const gap = Math.max(1, nextYear - marker.year)
  height += Math.min(32, gap * 3)

  return Math.min(560, Math.max(peopleOnly ? 148 : 188, height))
}

export function getMarkerWidth(marker: LifelineMarker, nextYear?: number) {
  const hasContent = hasMarkerContent(marker)
  const hasPeople = hasMarkerPeople(marker)
  const hasInlineMedia = markerInlineMediaCount(marker) > 0

  if (!nextYear) {
    if (hasInlineMedia) return 300
    return hasContent ? 360 : 80
  }
  if (!hasContent) return 80

  const peopleOnly =
    hasPeople &&
    marker.events.length === 0 &&
    (marker.companies?.length ?? 0) === 0

  if (peopleOnly) return 220

  const gap = Math.max(1, nextYear - marker.year)
  const width = Math.min(420, Math.max(290, gap * 36))
  return hasInlineMedia ? Math.max(width, 260) : width
}
