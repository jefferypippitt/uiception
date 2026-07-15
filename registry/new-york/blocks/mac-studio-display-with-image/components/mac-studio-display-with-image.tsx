import Image from "next/image"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("mac-studio-display-with-image")
import MacStudioDisplay from "../../mac-studio-display/components/mac-studio-display"

const SCREEN_WALLPAPER = blockImage("image.png")

export default function MacStudioDisplayWithImage() {
  return (
    <MacStudioDisplay>
      <div className="relative size-full">
        <Image
          src={SCREEN_WALLPAPER}
          alt="macOS default wallpaper"
          unoptimized
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 768px"
          loading="eager"
        />
      </div>
    </MacStudioDisplay>
  )
}
