import Image from "next/image"

import MacStudioDisplay from "../../mac-studio-display/components/mac-studio-display"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const SCREEN_WALLPAPER = `${mediaOrigin}/images/blocks/mac-studio-display-with-image/image.png`

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
