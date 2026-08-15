import { existsSync } from "node:fs"
import { extname, join } from "node:path"

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

export const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
] as const

export const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".mkv"] as const

const TEMPLATE_ID = "portfolio-v3"

function basenameWithoutExt(filename: string): string {
  const ext = extname(filename)
  return ext ? filename.slice(0, -ext.length) : filename
}

export function resolveLocalMediaFilename(
  dir: string,
  canonicalFilename: string,
  allowedExtensions: readonly string[],
): string | null {
  const exactPath = join(dir, canonicalFilename)
  if (existsSync(exactPath) && !canonicalFilename.endsWith(".gitkeep")) {
    return canonicalFilename
  }

  const base = basenameWithoutExt(canonicalFilename)
  for (const ext of allowedExtensions) {
    const candidate = `${base}${ext}`
    if (
      candidate !== canonicalFilename &&
      !candidate.endsWith(".gitkeep") &&
      existsSync(join(dir, candidate))
    ) {
      return candidate
    }
  }

  return null
}

function resolveInRoots(
  kind: "images" | "videos",
  relPath: string,
  allowedExtensions: readonly string[],
): string | null {
  const normalized = relPath.replace(/^\/+/, "").replace(/\\/g, "/")
  const slash = normalized.lastIndexOf("/")
  const dirPart = slash >= 0 ? normalized.slice(0, slash) : ""
  const filename = slash >= 0 ? normalized.slice(slash + 1) : normalized

  const roots = [
    {
      abs: join(process.cwd(), "public", kind, ...(dirPart ? [dirPart] : [])),
      urlBase: dirPart ? `/${kind}/${dirPart}` : `/${kind}`,
    },
    {
      abs: join(
        process.cwd(),
        "public",
        kind,
        "templates",
        TEMPLATE_ID,
        ...(dirPart ? [dirPart] : []),
      ),
      urlBase: dirPart
        ? `/${kind}/templates/${TEMPLATE_ID}/${dirPart}`
        : `/${kind}/templates/${TEMPLATE_ID}`,
    },
  ]

  for (const root of roots) {
    const resolved = resolveLocalMediaFilename(
      root.abs,
      filename,
      allowedExtensions,
    )
    if (resolved) {
      return `${root.urlBase}/${resolved}`
    }
  }

  return null
}

export function resolveTemplateImage(relPath: string): string | null {
  return resolveInRoots("images", relPath, IMAGE_EXTENSIONS)
}

export function resolveTemplateVideo(relPath: string): string | null {
  return resolveInRoots("videos", relPath, VIDEO_EXTENSIONS)
}

function mediaRel(filename: string, fallbackFolder: string) {
  return filename.includes("/") ? filename : `${fallbackFolder}/${filename}`
}

function resolveEvent(event: JonEvent): LifelineEvent {
  if (typeof event === "string" || Array.isArray(event)) return event

  const imageSrc = event.image
    ? resolveTemplateImage(mediaRel(event.image, "moments"))
    : null
  const videoSrc = event.video
    ? resolveTemplateVideo(mediaRel(event.video, "moments"))
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

function resolveMilestone(milestone: JonMilestone): {
  id: string
  events: LifelineEvent[]
  companies?: LifelineMarker["companies"]
  met?: LifelineMarker["met"]
} {
  const events = milestone.events.map(resolveEvent)

  return {
    id: milestone.id,
    events,
    ...(milestone.companies ? { companies: milestone.companies } : {}),
    ...(milestone.met?.length ? { met: milestone.met } : {}),
  }
}

export function getJonDoeLifeline() {
  const milestones: Record<number, ReturnType<typeof resolveMilestone>> = {}
  for (const [year, milestone] of Object.entries(jonDoeMilestones)) {
    milestones[Number(year)] = resolveMilestone(milestone)
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
