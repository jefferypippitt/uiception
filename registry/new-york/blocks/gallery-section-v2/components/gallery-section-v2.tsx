import { GalleryCard } from "./gallery-card"
import { createBlockImage } from "@/lib/block-media"
import { galleryFiles, type GalleryItem } from "../lib/config"

const blockImage = createBlockImage("gallery-section-v2")
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
