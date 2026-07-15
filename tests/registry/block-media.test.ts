import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { describe, expect, it } from "vitest"

import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  createBlockImage,
  createBlockVideo,
  resolveLocalMediaFilename,
} from "@/lib/block-media"

describe("block-media", () => {
  describe("resolveLocalMediaFilename", () => {
    it("returns exact match when canonical file exists", () => {
      const dir = mkdtempSync(join(tmpdir(), "block-media-"))
      writeFileSync(join(dir, "image.png"), "")
      expect(resolveLocalMediaFilename(dir, "image.png", IMAGE_EXTENSIONS)).toBe(
        "image.png",
      )
      rmSync(dir, { recursive: true })
    })

    it.each([
      ["image.png", "image.jpeg", IMAGE_EXTENSIONS],
      ["image.png", "image.webp", IMAGE_EXTENSIONS],
      ["image.png", "image.avif", IMAGE_EXTENSIONS],
      ["logo.svg", "logo.png", IMAGE_EXTENSIONS],
      ["image-1.jpg", "image-1.png", IMAGE_EXTENSIONS],
      ["video.mp4", "video.webm", VIDEO_EXTENSIONS],
      ["video.mp4", "video.mov", VIDEO_EXTENSIONS],
    ])(
      "finds alternate %s when only %s exists",
      (canonical, alternate, extensions) => {
        const dir = mkdtempSync(join(tmpdir(), "block-media-"))
        writeFileSync(join(dir, alternate), "")
        expect(resolveLocalMediaFilename(dir, canonical, extensions)).toBe(
          alternate,
        )
        rmSync(dir, { recursive: true })
      },
    )

    it("prefers exact match over alternates", () => {
      const dir = mkdtempSync(join(tmpdir(), "block-media-"))
      writeFileSync(join(dir, "image.png"), "")
      writeFileSync(join(dir, "image.jpeg"), "")
      expect(resolveLocalMediaFilename(dir, "image.png", IMAGE_EXTENSIONS)).toBe(
        "image.png",
      )
      rmSync(dir, { recursive: true })
    })

    it("returns null when no local file exists", () => {
      const dir = mkdtempSync(join(tmpdir(), "block-media-"))
      expect(resolveLocalMediaFilename(dir, "image.png", IMAGE_EXTENSIONS)).toBe(
        null,
      )
      rmSync(dir, { recursive: true })
    })
  })

  describe("createBlockImage", () => {
    it("returns local path for alternate extension", () => {
      const cwd = process.cwd()
      const tempRoot = mkdtempSync(join(tmpdir(), "block-media-app-"))
      const publicDir = join(tempRoot, "public", "images", "blocks", "test-block")
      mkdirSync(publicDir, { recursive: true })
      writeFileSync(join(publicDir, "image.jpeg"), "")

      const prev = process.cwd()
      process.chdir(tempRoot)
      try {
        const blockImage = createBlockImage("test-block")
        expect(blockImage("image.png")).toBe(
          "/images/blocks/test-block/image.jpeg",
        )
      } finally {
        process.chdir(prev)
        rmSync(tempRoot, { recursive: true })
      }

      expect(cwd).toBeTruthy()
    })

    it("falls back to CDN when no local file exists", () => {
      const blockImage = createBlockImage("nonexistent-block-slot", "https://example.com")
      expect(blockImage("image.png")).toBe(
        "https://example.com/images/blocks/nonexistent-block-slot/image.png",
      )
    })
  })

  describe("createBlockVideo", () => {
    it("falls back to CDN when no local file exists", () => {
      const blockVideo = createBlockVideo("nonexistent-block-slot", "https://example.com")
      expect(blockVideo("video.mp4")).toBe(
        "https://example.com/videos/blocks/nonexistent-block-slot/video.mp4",
      )
    })
  })
})
