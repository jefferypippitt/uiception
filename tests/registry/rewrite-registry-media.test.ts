import { describe, expect, it } from "vitest"

import { rewriteBlockMediaForConsumers } from "../../scripts/rewrite-registry-media.mjs"

describe("rewriteBlockMediaForConsumers", () => {
  it("rewrites same-origin helpers to the CDN", () => {
    const input = `const blockImage = (filename: string) =>
  \`/images/blocks/gallery-section-v3/\${filename}\`
`

    const out = rewriteBlockMediaForConsumers(input)

    expect(out).toContain(
      "`https://uiception.com/images/blocks/gallery-section-v3/${filename}`",
    )
    expect(out).not.toContain("`/images/blocks/")
  })

  it("rewrites same-origin string literals to the CDN", () => {
    const input = `const HERO = "/images/blocks/gallery-section-v3/image-1.jpg"\n`
    const out = rewriteBlockMediaForConsumers(input)
    expect(out).toContain(
      '"https://uiception.com/images/blocks/gallery-section-v3/image-1.jpg"',
    )
  })

  it("rewrites a single-file mediaOrigin constant and drops the declaration", () => {
    const input = `import Image from "next/image"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const HERO_V1_BG = \`\${mediaOrigin}/images/blocks/hero-section-v1/image.png\`

export function HeroV1Image() {
  return <Image src={HERO_V1_BG} unoptimized alt="" fill />
}
`

    const out = rewriteBlockMediaForConsumers(input)

    expect(out).not.toContain("mediaOrigin")
    expect(out).not.toContain("NEXT_PUBLIC_BASE_URL")
    expect(out).toContain(
      'const HERO_V1_BG = "https://uiception.com/images/blocks/hero-section-v1/image.png"',
    )
  })

  it("rewrites video paths", () => {
    const input = `const SCREEN_VIDEO = "/videos/blocks/macbook-pro-with-video/video.mp4"\n`
    const out = rewriteBlockMediaForConsumers(input)
    expect(out).toContain(
      '"https://uiception.com/videos/blocks/macbook-pro-with-video/video.mp4"',
    )
  })

  it("leaves files without block media paths untouched", () => {
    const input = `export default function NoMedia() { return null }\n`
    expect(rewriteBlockMediaForConsumers(input)).toBe(input)
  })
})
