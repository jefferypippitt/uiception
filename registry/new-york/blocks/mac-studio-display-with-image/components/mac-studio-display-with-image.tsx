import { existsSync } from "node:fs"
import { join } from "node:path"

import Image from "next/image"

import MacStudioDisplay from "../../mac-studio-display/components/mac-studio-display"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/mac-studio-display-with-image/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}
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
