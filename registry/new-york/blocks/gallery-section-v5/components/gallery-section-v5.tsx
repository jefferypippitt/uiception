import { GalleryArcCard } from "./gallery-arc-card"
import { createBlockImage } from "@/lib/block-media"
import {
  RING_SLOTS,
  galleryFiles,
  sectionMeta,
  type GalleryItem,
} from "../lib/config"
import "../styles/gallery-section-v5.css"

const blockImage = createBlockImage("gallery-section-v5")
const galleryItems: GalleryItem[] = galleryFiles.map(({ file, alt }, index) => ({
  id: String(index + 1),
  alt,
  imageSrc: blockImage(file),
}))

export type GallerySectionV5Props = {
  header?: { title: string; description?: string } | false
  items?: GalleryItem[]
}

export default function GallerySectionV5({
  header = sectionMeta,
  items = galleryItems,
}: GallerySectionV5Props = {}) {
  const slots = Array.from({ length: RING_SLOTS }, (_, slot) => ({
    slot,
    item: items[slot % items.length],
  }))

  return (
    <section className="gsv5-stage relative isolate overflow-hidden py-4 md:py-6 lg:py-8">
      <div aria-hidden className="gsv5-fade pointer-events-none absolute inset-0 -z-10">
        <div className="gsv5-orbit absolute left-1/2 rounded-full border border-dashed border-border" />
      </div>

      <div className="gsv5-fade absolute inset-0 -z-10">
        <ul className="gsv5-ring absolute left-1/2" aria-label="Gallery">
          {slots.map(({ slot, item }) => (
            <GalleryArcCard
              key={slot}
              item={item}
              angle={(360 / RING_SLOTS) * slot}
              decorative={slot >= items.length}
              priority={slot < 3 || slot > RING_SLOTS - 3}
            />
          ))}
        </ul>
      </div>

      {header !== false ? (
        <div className="gsv5-header pointer-events-none mx-auto max-w-md px-4 text-center *:pointer-events-auto">
          <h2 className="text-4xl font-medium leading-[1.1] tracking-[-0.03em] lg:text-5xl">
            {header.title}
          </h2>
          {header.description ? (
            <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-muted-foreground">
              {header.description}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
