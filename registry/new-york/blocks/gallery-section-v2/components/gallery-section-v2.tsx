import { GalleryCard } from "./gallery-card"
import { galleryItems } from "../lib/config"

export default function GallerySectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-4xl font-medium leading-[1.1] tracking-[-0.03em] lg:text-5xl">
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
