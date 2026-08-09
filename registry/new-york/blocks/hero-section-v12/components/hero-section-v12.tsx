import { createBlockImage } from "@/lib/block-media"

import { slideFiles } from "../lib/config"
import { HeroV12Carousel } from "./hero-v12-carousel"

const blockImage = createBlockImage("hero-section-v12")

const slides = slideFiles.map(({ file, alt }) => ({
  src: blockImage(file),
  alt,
}))

export default function HeroSectionV12() {
  return <HeroV12Carousel slides={slides} />
}
