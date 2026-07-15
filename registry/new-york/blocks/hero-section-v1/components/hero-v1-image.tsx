import { existsSync } from "node:fs"
import { join } from "node:path"

import Image from "next/image"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/hero-section-v1/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}
const HERO_V1_BG = blockImage("image.png")

export function HeroV1Image() {
  return (
    <Image
      src={HERO_V1_BG}
      unoptimized
      alt=""
      fill
      className="pointer-events-none absolute inset-0 z-0 object-cover object-center"
      sizes="(max-width: 1024px) 100vw, 1152px"
      preload={true}
      aria-hidden
    />
  )
}
