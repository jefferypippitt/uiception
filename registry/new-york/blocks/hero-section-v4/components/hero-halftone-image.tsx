"use client"

import { HalftoneDots } from "@paper-design/shaders-react"

import { blockImageUrl } from "@/lib/block-image-url"

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
      image={blockImageUrl(
        "https://uiception.com/images/blocks/hero-section-v4/hero-section-v4-bg.png",
        "/images/blocks/hero-section-v4/hero-section-v4-bg.png",
      )}
      inverted={false}
      originalColors={false}
      radius={1.5}
      size={0.2}
      type="gooey"
    />
  )
}
