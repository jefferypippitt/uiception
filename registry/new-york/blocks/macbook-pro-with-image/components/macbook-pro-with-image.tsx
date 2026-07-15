import { existsSync } from "node:fs"
import { join } from "node:path"

import Image from "next/image"

import MacbookPro from "../../macbook-pro/components/macbook-pro"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/macbook-pro-with-image/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}
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
