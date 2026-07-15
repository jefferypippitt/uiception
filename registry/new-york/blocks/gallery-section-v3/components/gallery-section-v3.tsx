import { GalleryBentoCard } from "./gallery-bento-card"
import { galleryFiles, sectionMeta, type GalleryItem } from "../lib/config"
import "../styles/gallery-section-v3.css"

const blockImage = (filename: string) =>
  `/images/blocks/gallery-section-v3/${filename}`

const galleryItems: GalleryItem[] = galleryFiles.map(
  ({ file, ...rest }, index) => ({
    id: String(index + 1),
    ...rest,
    imageSrc: blockImage(file),
  }),
)

export type GallerySectionV3Props = {
  header?: { title: string; description?: string } | false
  items?: GalleryItem[]
}

export default function GallerySectionV3({
  header = sectionMeta,
  items = galleryItems,
}: GallerySectionV3Props = {}) {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        {header !== false ? (
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <h2 className="text-4xl font-medium leading-[1.1] tracking-[-0.03em] lg:text-5xl">
              {header.title}
            </h2>
            {header.description ? (
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {header.description}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="gsv3-bento">
          {items.map((item, index) => (
            <GalleryBentoCard
              key={item.id}
              item={item}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
