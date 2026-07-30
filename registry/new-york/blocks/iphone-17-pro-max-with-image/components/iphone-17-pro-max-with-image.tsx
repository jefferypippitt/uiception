import Image from "next/image"
import { createBlockImage } from "@/lib/block-media"

import Iphone17ProMax from "../../iphone-17-pro-max/components/iphone-17-pro-max"

const blockImage = createBlockImage("iphone-17-pro-max-with-image")
const SCREEN_WALLPAPER = blockImage("image.png")

export default function Iphone17ProMaxWithImage() {
  return (
    <Iphone17ProMax statusBar={{ tint: "light" }}>
      <div className="relative size-full overflow-hidden">
        <Image
          src={SCREEN_WALLPAPER}
          alt="iPhone screen wallpaper"
          unoptimized
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 384px"
          loading="eager"
        />
      </div>
    </Iphone17ProMax>
  )
}
