import { describe, expect, it } from "vitest"

import {
  codeViewContentForRegistryFile,
  isBinaryFile,
  shouldStripRegistryFileContent,
} from "@/lib/registry-code-view"

describe("registry-code-view", () => {
  it("treats video extensions as binary", () => {
    expect(isBinaryFile("public/videos/blocks/foo/screen-demo.mp4")).toBe(true)
    expect(isBinaryFile("public/videos/blocks/foo/clip.webm")).toBe(true)
  })

  it("strips bundled media and installUrl entries", () => {
    expect(
      shouldStripRegistryFileContent(
        "public/videos/blocks/macbook-pro-with-video/screen-demo.mp4",
        "huge",
        { installUrl: "https://uiception.com/videos/blocks/macbook-pro-with-video/screen-demo.mp4" }
      )
    ).toBe(true)
    expect(
      shouldStripRegistryFileContent(
        "public/images/blocks/hero/hero.png",
        undefined
      )
    ).toBe(true)
  })

  it("returns a short placeholder instead of raw content for mp4", () => {
    const out = codeViewContentForRegistryFile(
      "public/videos/blocks/macbook-pro-with-video/screen-demo.mp4",
      "x".repeat(1_000_000)
    )
    expect(out.length).toBeLessThan(500)
    expect(out).toContain("screen-demo.mp4")
    expect(out).not.toContain("xxxx")
  })
})
