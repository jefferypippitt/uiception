import { existsSync } from "node:fs"
import { join } from "node:path"

import { GalleryCard } from "./gallery-card"
import { galleryFiles, type GalleryItem } from "../lib/config"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/gallery-section-v2/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

const galleryItems: GalleryItem[] = galleryFiles.map(
  ({ file, ...rest }, index) => ({
    id: String(index + 1),
    ...rest,
    imageSrc: blockImage(file),
  }),
)

export default function GallerySectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 font-mono text-4xl lg:text-5xl">
          Gallery
        </h2>
        <div className="grid grid-cols-3 gap-x-6 gap-y-10">
          {galleryItems.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
