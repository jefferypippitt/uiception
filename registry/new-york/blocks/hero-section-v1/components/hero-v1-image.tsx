import Image from "next/image"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("hero-section-v1")

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
