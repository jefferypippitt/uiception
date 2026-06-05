import GalleryTrack from "./gallery-track"
import { imageFiles, sectionMeta, type GalleryItem } from "../lib/config"

const galleryItems: GalleryItem[] = imageFiles.map(({ file, alt }, index) => ({
  id: `panel-${index + 1}`,
  label: `Panel ${index + 1}`,
  alt,
  imageSrc: file,
}))

export type GallerySectionV1Props = {
  /** Pass `false` to render only the gallery canvas (no title or description). */
  header?: { title: string; description?: string } | false
  items?: GalleryItem[]
}

export default function GallerySectionV1({
  header = sectionMeta,
  items = galleryItems,
}: GallerySectionV1Props = {}) {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        {header !== false ? (
          <div className="mb-10 md:mb-12">
            <h2 className="text-4xl font-medium leading-[1.1] tracking-[-0.03em] lg:text-5xl">
              {header.title}
            </h2>
            {header.description ? (
              <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                {header.description}
              </p>
            ) : null}
          </div>
        ) : null}
        <GalleryTrack items={items} />
      </div>
    </section>
  )
}
