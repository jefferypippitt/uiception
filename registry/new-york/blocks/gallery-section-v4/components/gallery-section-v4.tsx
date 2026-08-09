import { GalleryMasonryItem } from "./gallery-masonry-item"
import { createBlockImage } from "@/lib/block-media"
import { ROW_UNIT, imageFiles, type GalleryItem } from "../lib/config"

const blockImage = createBlockImage("gallery-section-v4")
const galleryItems: GalleryItem[] = imageFiles.map(
  ({ file, alt, heightPx }, index) => ({
    id: `image-${index + 1}`,
    alt,
    span: Math.round(heightPx / ROW_UNIT),
    imageSrc: blockImage(file),
  }),
)

export type GallerySectionV4Props = {
  items?: GalleryItem[]
}

export default function GallerySectionV4({
  items = galleryItems,
}: GallerySectionV4Props = {}) {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-flow-dense auto-rows-[4px] grid-cols-2 gap-x-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <GalleryMasonryItem
              key={item.id}
              item={item}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
