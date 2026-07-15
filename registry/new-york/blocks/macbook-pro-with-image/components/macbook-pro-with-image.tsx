import Image from "next/image"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("macbook-pro-with-image")

import MacbookPro from "../../macbook-pro/components/macbook-pro"

const SCREEN_WALLPAPER = blockImage("image.png")

export default function MacbookProWithImage() {
  return (
    <MacbookPro>
      <div className="relative size-full">
        <Image
          src={SCREEN_WALLPAPER}
          alt="macOS Monterey default dark wallpaper"
          unoptimized
          fill
          className="object-cover object-center"
          sizes="(max-width: 896px) 100vw, 896px"
          loading="eager"
        />
      </div>
    </MacbookPro>
  )
}
