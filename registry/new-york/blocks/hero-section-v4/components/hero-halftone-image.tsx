"use client"

import { HalftoneDots } from "@paper-design/shaders-react"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const HERO_V4_BG = `${mediaOrigin}/images/blocks/hero-section-v4/image.png`

export function HeroHalftoneImage() {
  return (
    <HalftoneDots
      aria-hidden={true}
      className="absolute inset-0 h-full w-full"
      colorBack="#f2f1e8"
      colorFront="#2b2b2b"
      contrast={0.5}
      fit="cover"
      grainMixer={0.4}
      grainOverlay={0.2}
      grainSize={0.5}
      grid="hex"
      image={HERO_V4_BG}
      inverted={false}
      originalColors={false}
      radius={1.5}
      size={0.2}
      type="gooey"
    />
  )
}
