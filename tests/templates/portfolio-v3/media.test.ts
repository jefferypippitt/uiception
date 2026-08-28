import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import {
  getJonDoeLifeline,
  resolveAvatarSrc,
  resolveLocalMediaFilename,
  resolveTemplateImage,
  resolveTemplateVideo,
} from "@/registry/new-york/templates/portfolio-v3/lib/media"

const repoRoot = process.cwd()

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
] as const

describe("portfolio-v3 media", () => {
  const dirs: string[] = []

  afterEach(() => {
    for (const dir of dirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it("CDN-referenced demo assets exist on the authoring disk", () => {
    const assets = [
      "public/images/templates/portfolio-v3/avatar.png",
      "public/images/templates/portfolio-v3/destinations/japan.jpg",
      "public/images/templates/portfolio-v3/destinations/italy.jpg",
      "public/images/templates/portfolio-v3/destinations/greece.jpg",
      "public/images/templates/portfolio-v3/moments/vercel-ship-2024.jpg",
      "public/images/templates/portfolio-v3/moments/vercel-ship-2025.jpg",
      "public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mp4",
      "public/videos/templates/portfolio-v3/moments/compile-26.mp4",
    ]
    for (const rel of assets) {
      expect(existsSync(join(repoRoot, rel)), `missing ${rel}`).toBe(true)
    }
  })

  describe("resolveLocalMediaFilename", () => {
    it("returns null when no local file exists", () => {
      const dir = mkdtempSync(join(tmpdir(), "p3-media-"))
      dirs.push(dir)
      expect(resolveLocalMediaFilename(dir, "ryan-park.png", IMAGE_EXTENSIONS)).toBe(
        null,
      )
    })

    it("finds alternate extension when only webp exists", () => {
      const dir = mkdtempSync(join(tmpdir(), "p3-media-"))
      dirs.push(dir)
      writeFileSync(join(dir, "ryan-park.webp"), "")
      expect(resolveLocalMediaFilename(dir, "ryan-park.png", IMAGE_EXTENSIONS)).toBe(
        "ryan-park.webp",
      )
    })

    it("does not treat a .gitkeep slot marker as the asset", () => {
      const dir = mkdtempSync(join(tmpdir(), "p3-media-"))
      dirs.push(dir)
      writeFileSync(join(dir, "compile-26.mp4.gitkeep"), "placeholder")
      expect(
        resolveLocalMediaFilename(dir, "compile-26.mp4", [
          ".mp4",
          ".webm",
          ".mov",
          ".m4v",
          ".mkv",
        ]),
      ).toBe(null)
    })

    it("still finds a real file when a matching .gitkeep sits beside it", () => {
      const dir = mkdtempSync(join(tmpdir(), "p3-media-"))
      dirs.push(dir)
      writeFileSync(join(dir, "compile-26.mp4.gitkeep"), "placeholder")
      writeFileSync(join(dir, "compile-26.mkv"), "")
      expect(
        resolveLocalMediaFilename(dir, "compile-26.mp4", [
          ".mp4",
          ".webm",
          ".mov",
          ".m4v",
          ".mkv",
        ]),
      ).toBe("compile-26.mkv")
    })
  })

  describe("resolveTemplateImage", () => {
    it("falls back to CDN when neither install nor preview path has the file", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      mkdirSync(join(tempRoot, "public"), { recursive: true })

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(
          resolveTemplateImage("people/ryan-park.png", "https://example.com"),
        ).toBe(
          "https://example.com/images/templates/portfolio-v3/people/ryan-park.png",
        )
      } finally {
        process.chdir(prev)
      }
    })

    it("prefers consumer install path over host preview path", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const installDir = join(tempRoot, "public", "images", "people")
      const previewDir = join(
        tempRoot,
        "public",
        "images",
        "templates",
        "portfolio-v3",
        "people",
      )
      mkdirSync(installDir, { recursive: true })
      mkdirSync(previewDir, { recursive: true })
      writeFileSync(join(installDir, "ryan-park.png"), "")
      writeFileSync(join(previewDir, "ryan-park.jpg"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(resolveTemplateImage("people/ryan-park.png")).toBe(
          "/images/people/ryan-park.png",
        )
      } finally {
        process.chdir(prev)
      }
    })

    it("falls back to host preview path when consumer file is absent", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const previewDir = join(
        tempRoot,
        "public",
        "images",
        "templates",
        "portfolio-v3",
        "people",
      )
      mkdirSync(previewDir, { recursive: true })
      writeFileSync(join(previewDir, "ryan-park.webp"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(resolveTemplateImage("people/ryan-park.png")).toBe(
          "/images/templates/portfolio-v3/people/ryan-park.webp",
        )
      } finally {
        process.chdir(prev)
      }
    })
  })

  describe("resolveAvatarSrc", () => {
    it("falls back to CDN when no local avatar exists", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      mkdirSync(join(tempRoot, "public"), { recursive: true })

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(resolveAvatarSrc("https://example.com")).toBe(
          "https://example.com/images/templates/portfolio-v3/avatar.png",
        )
      } finally {
        process.chdir(prev)
      }
    })
  })

  describe("resolveTemplateVideo", () => {
    it("falls back to CDN when neither install nor preview path has the file", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      mkdirSync(join(tempRoot, "public"), { recursive: true })

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(
          resolveTemplateVideo("moments/compile-26.mkv", "https://example.com"),
        ).toBe(
          "https://example.com/videos/templates/portfolio-v3/moments/compile-26.mkv",
        )
      } finally {
        process.chdir(prev)
      }
    })

    it("resolves host preview video path", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const previewDir = join(
        tempRoot,
        "public",
        "videos",
        "templates",
        "portfolio-v3",
        "moments",
      )
      mkdirSync(previewDir, { recursive: true })
      writeFileSync(join(previewDir, "platform-launch.mp4"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(resolveTemplateVideo("moments/platform-launch.mp4")).toBe(
          "/videos/templates/portfolio-v3/moments/platform-launch.mp4",
        )
      } finally {
        process.chdir(prev)
      }
    })

    it("falls back to mkv when the canonical mp4 is absent", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const previewDir = join(
        tempRoot,
        "public",
        "videos",
        "templates",
        "portfolio-v3",
        "moments",
      )
      mkdirSync(previewDir, { recursive: true })
      writeFileSync(join(previewDir, "compile-26.mkv"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        expect(resolveTemplateVideo("moments/compile-26.mp4")).toBe(
          "/videos/templates/portfolio-v3/moments/compile-26.mkv",
        )
      } finally {
        process.chdir(prev)
      }
    })
  })

  describe("getJonDoeLifeline", () => {
    it("uses CDN urls when no local assets exist", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      mkdirSync(join(tempRoot, "public"), { recursive: true })

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline("https://example.com")
        expect(life.name).toBe("Jon Doe")
        expect(life.birthYear).toBe(1992)
        expect(life.markers.length).toBeGreaterThan(10)

        expect(life.markers.find((m) => m.year === 2010)?.companies).toBeUndefined()
        expect(life.markers.find((m) => m.year === 2015)?.companies).toBeUndefined()
        expect(life.markers.find((m) => m.year === 2018)?.companies).toBeUndefined()
        expect(life.markers.find((m) => m.year === 2021)?.companies).toBeUndefined()
        expect(life.markers.find((m) => m.year === 2024)?.companies).toBeUndefined()

        const year2025 = life.markers.find((m) => m.year === 2025)
        expect(year2025?.globalEvents?.[0]?.name).toBe("CES 2025 Keynote NVIDIA")
        expect(year2025?.globalEvents?.[0]?.place).toBe("Las Vegas")
        expect(year2025?.globalEvents?.[0]?.date).toBe("Jan 6, 2025")
        expect(year2025?.globalEvents?.[0]?.icon).toBe("nvidia")
        expect(year2025?.globalEvents?.[1]?.name).toBe("Vercel Ship 2025")

        const withGlobalEvents = life.markers.find((m) => m.year === 2026)
        expect(withGlobalEvents?.globalEvents?.[0]?.name).toBe("Compile 26")
        expect(withGlobalEvents?.globalEvents?.[0]?.place).toBe(
          "Fort Mason, San Francisco",
        )
        expect(withGlobalEvents?.globalEvents?.[0]?.date).toBe("Jun 22, 2026")
        expect(withGlobalEvents?.globalEvents?.[0]?.icon).toBe("cursor")
        expect(withGlobalEvents?.globalEvents?.[1]?.name).toBe(
          "Grok Bot Founder Build Night",
        )
        expect(withGlobalEvents?.globalEvents?.[1]?.icon).toBe("cursor")
        expect(withGlobalEvents?.globalEvents?.[2]?.name).toBe(
          "Cursor Conversations London",
        )
        expect(withGlobalEvents?.globalEvents?.[3]?.name).toBe("Vercel Ship 2026")
        expect(withGlobalEvents?.globalEvents?.[3]?.place).toBe(
          "Palace of Fine Arts, San Francisco",
        )
        expect(withGlobalEvents?.globalEvents?.[3]?.icon).toBe("vercel")

        const college = life.markers.find((m) => m.year === 2010)
        const collegeEvent = college?.events[0]
        expect(
          typeof collegeEvent === "object" &&
            !Array.isArray(collegeEvent) &&
            "category" in collegeEvent
            ? collegeEvent.category
            : undefined,
        ).toBe("college")

        const work = life.markers.find((m) => m.year === 2015)
        const workEvent = work?.events[0]
        expect(
          typeof workEvent === "object" &&
            !Array.isArray(workEvent) &&
            "category" in workEvent
            ? workEvent.category
            : undefined,
        ).toBe("work")

        const japan = life.markers.find((m) => m.year === 2014)
        const japanEvent = japan?.events[0]
        expect(
          typeof japanEvent === "object" &&
            !Array.isArray(japanEvent) &&
            "category" in japanEvent
            ? japanEvent.category
            : undefined,
        ).toBe("destination")
        expect(life.legend?.some((item) => item.type === "destination")).toBe(
          true,
        )
        expect(japanEvent).toMatchObject({
          image: {
            src: "https://example.com/images/templates/portfolio-v3/destinations/japan.jpg",
          },
        })

        const year2024 = life.markers.find((m) => m.year === 2024)
        const ship2024 = year2024?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("Vercel Ship"),
        )
        expect(ship2024).toMatchObject({
          image: {
            src: "https://example.com/images/templates/portfolio-v3/moments/vercel-ship-2024.jpg",
          },
        })

        const ces = year2025?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("CES 2025"),
        )
        expect(ces).toMatchObject({
          video: {
            src: "https://example.com/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mp4",
          },
        })
      } finally {
        process.chdir(prev)
      }
    })

    it("attaches the CES 2025 NVIDIA keynote clip when present", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const videosDir = join(tempRoot, "public", "videos", "moments")
      mkdirSync(videosDir, { recursive: true })
      writeFileSync(join(videosDir, "ces-2025-nvidia.mp4"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2025 = life.markers.find((m) => m.year === 2025)
        const ces = year2025?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("CES 2025"),
        )
        expect(ces).toMatchObject({
          video: {
            src: "/videos/moments/ces-2025-nvidia.mp4",
          },
        })
        expect(
          typeof ces === "object" && !Array.isArray(ces) && "image" in ces
            ? ces.image
            : undefined,
        ).toBeUndefined()
      } finally {
        process.chdir(prev)
      }
    })

    it("attaches a video-only event clip without an image", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const videosDir = join(tempRoot, "public", "videos", "moments")
      mkdirSync(videosDir, { recursive: true })
      writeFileSync(join(videosDir, "compile-26.mp4"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2026 = life.markers.find((m) => m.year === 2026)
        const keynote = year2026?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("Compile 26"),
        )
        expect(keynote).toMatchObject({
          video: {
            src: "/videos/moments/compile-26.mp4",
          },
        })
        expect(
          typeof keynote === "object" &&
            !Array.isArray(keynote) &&
            "image" in keynote
            ? keynote.image
            : undefined,
        ).toBeUndefined()
      } finally {
        process.chdir(prev)
      }
    })

    it("attaches resolved moment photos when present", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const momentsDir = join(tempRoot, "public", "images", "moments")
      mkdirSync(momentsDir, { recursive: true })
      writeFileSync(join(momentsDir, "vercel-ship-2024.jpg"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2024 = life.markers.find((m) => m.year === 2024)
        const ship = year2024?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("Vercel Ship"),
        )
        expect(ship).toMatchObject({
          image: {
            src: "/images/moments/vercel-ship-2024.jpg",
          },
        })
      } finally {
        process.chdir(prev)
      }
    })

    it("attaches a vercel ship still when the image slot is filled", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const imagesDir = join(
        tempRoot,
        "public",
        "images",
        "templates",
        "portfolio-v3",
        "moments",
      )
      mkdirSync(imagesDir, { recursive: true })
      writeFileSync(join(imagesDir, "vercel-ship-2024.png"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2024 = life.markers.find((m) => m.year === 2024)
        const ship = year2024?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("Vercel Ship"),
        )
        expect(ship).toMatchObject({
          image: {
            src: "/images/templates/portfolio-v3/moments/vercel-ship-2024.png",
          },
        })
      } finally {
        process.chdir(prev)
      }
    })

    it("attaches a vercel ship 2025 still when the image slot is filled", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const imagesDir = join(
        tempRoot,
        "public",
        "images",
        "templates",
        "portfolio-v3",
        "moments",
      )
      mkdirSync(imagesDir, { recursive: true })
      writeFileSync(join(imagesDir, "vercel-ship-2025.png"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2025 = life.markers.find((m) => m.year === 2025)
        const ship = year2025?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("Vercel Ship 2025"),
        )
        expect(ship).toMatchObject({
          image: {
            src: "/images/templates/portfolio-v3/moments/vercel-ship-2025.png",
          },
        })
      } finally {
        process.chdir(prev)
      }
    })

    it("attaches a destination still from public/images/destinations/", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const imagesDir = join(tempRoot, "public", "images", "destinations")
      mkdirSync(imagesDir, { recursive: true })
      writeFileSync(join(imagesDir, "japan.jpg"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2014 = life.markers.find((m) => m.year === 2014)
        const japan = year2014?.events[0]
        expect(japan).toMatchObject({
          text: "Japan",
          category: "destination",
          image: {
            src: "/images/destinations/japan.jpg",
            alt: "Japan",
          },
        })
      } finally {
        process.chdir(prev)
      }
    })

    it("falls back to mkv for a video-only event when the canonical mp4 is absent", () => {
      const tempRoot = mkdtempSync(join(tmpdir(), "p3-app-"))
      dirs.push(tempRoot)
      const videosDir = join(
        tempRoot,
        "public",
        "videos",
        "templates",
        "portfolio-v3",
        "moments",
      )
      mkdirSync(videosDir, { recursive: true })
      writeFileSync(join(videosDir, "compile-26.mkv"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const life = getJonDoeLifeline()
        const year2026 = life.markers.find((m) => m.year === 2026)
        const keynote = year2026?.events.find(
          (event) =>
            typeof event === "object" &&
            !Array.isArray(event) &&
            typeof event.text === "string" &&
            event.text.includes("Compile 26"),
        )
        expect(keynote).toMatchObject({
          video: {
            src: "/videos/templates/portfolio-v3/moments/compile-26.mkv",
          },
        })
      } finally {
        process.chdir(prev)
      }
    })
  })
})
