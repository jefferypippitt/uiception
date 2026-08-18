import { existsSync } from "node:fs"
import { join } from "node:path"

import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  createTemplateImage,
  createTemplateVideo,
  resolveLocalMediaFilename,
} from "@/lib/block-media"

import type {
  LifelineEvent,
  LifelineMarker,
} from "../components/lifeline/types"
import { defineLifeline } from "./lifeline-data"

import {
  jonDoeMeta,
  jonDoeMilestones,
  type JonEvent,
  type JonMilestone,
} from "./jon-doe"

export {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  resolveLocalMediaFilename,
} from "@/lib/block-media"

const TEMPLATE_ID = "portfolio-v3"
const CDN_ORIGIN = "https://uiception.com"

function resolveConsumerMediaUrl(
  kind: "images" | "videos",
  relPath: string,
  allowedExtensions: readonly string[],
): string | null {
  const normalized = relPath.replace(/^\/+/, "").replace(/\\/g, "/")
  const slash = normalized.lastIndexOf("/")
  const dirPart = slash >= 0 ? normalized.slice(0, slash) : ""
  const filename = slash >= 0 ? normalized.slice(slash + 1) : normalized
  const abs = join(process.cwd(), "public", kind, ...(dirPart ? [dirPart] : []))
  const resolved = resolveLocalMediaFilename(abs, filename, allowedExtensions)
  if (!resolved || resolved.endsWith(".gitkeep")) return null
  const urlBase = dirPart ? `/${kind}/${dirPart}` : `/${kind}`
  return `${urlBase}/${resolved}`
}

export function resolveTemplateImage(
  relPath: string,
  origin = CDN_ORIGIN,
): string {
  return (
    resolveConsumerMediaUrl("images", relPath, IMAGE_EXTENSIONS) ??
    createTemplateImage(TEMPLATE_ID, origin)(relPath)
  )
}

export function resolveTemplateVideo(
  relPath: string,
  origin = CDN_ORIGIN,
): string {
  return (
    resolveConsumerMediaUrl("videos", relPath, VIDEO_EXTENSIONS) ??
    createTemplateVideo(TEMPLATE_ID, origin)(relPath)
  )
}

function mediaRel(filename: string, fallbackFolder: string) {
  return filename.includes("/") ? filename : `${fallbackFolder}/${filename}`
}

function resolveEvent(event: JonEvent, origin: string): LifelineEvent {
  if (typeof event === "string" || Array.isArray(event)) return event

  const imageSrc = event.image
    ? resolveTemplateImage(mediaRel(event.image, "moments"), origin)
    : null
  const videoSrc = event.video
    ? resolveTemplateVideo(mediaRel(event.video, "moments"), origin)
    : null
  const alt =
    typeof event.text === "string" ? event.text : "Timeline moment"

  if (!imageSrc && !videoSrc && !event.category) {
    return typeof event.text === "string" || Array.isArray(event.text)
      ? (event.text as LifelineEvent)
      : { text: event.text }
  }

  return {
    text: event.text,
    ...(event.category ? { category: event.category } : {}),
    ...(imageSrc ? { image: { src: imageSrc, alt } } : {}),
    ...(videoSrc ? { video: { src: videoSrc, alt } } : {}),
  }
}

function resolveMilestone(
  milestone: JonMilestone,
  origin: string,
): {
  id: string
  events: LifelineEvent[]
  companies?: LifelineMarker["companies"]
  globalEvents?: LifelineMarker["globalEvents"]
} {
  const events = milestone.events.map((event) => resolveEvent(event, origin))

  return {
    id: milestone.id,
    events,
    ...(milestone.companies ? { companies: milestone.companies } : {}),
    ...(milestone.globalEvents?.length
      ? { globalEvents: milestone.globalEvents }
      : {}),
  }
}

export function getJonDoeLifeline(origin = CDN_ORIGIN) {
  const milestones: Record<number, ReturnType<typeof resolveMilestone>> = {}
  for (const [year, milestone] of Object.entries(jonDoeMilestones)) {
    milestones[Number(year)] = resolveMilestone(milestone, origin)
  }

  return defineLifeline({
    slug: jonDoeMeta.slug,
    name: jonDoeMeta.name,
    birthYear: jonDoeMeta.birthYear,
    endYear: jonDoeMeta.endYear,
    description: jonDoeMeta.description,
    legend: jonDoeMeta.legend,
    milestones,
  })
}

export function resolveAvatarSrc(origin = CDN_ORIGIN): string {
  const installDir = join(process.cwd(), "public")
  for (const ext of IMAGE_EXTENSIONS) {
    const filename = `avatar${ext}`
    if (existsSync(join(installDir, filename))) {
      return `/${filename}`
    }
  }

  return resolveTemplateImage("avatar.png", origin)
}
