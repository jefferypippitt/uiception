import { createBlockImage } from "@/lib/block-media"

import { GallerySectionV6Root } from "./gallery-section-v6-root"
import { galleryFiles, type GalleryItem } from "../lib/config"

const blockImage = createBlockImage("gallery-section-v6")

const galleryItems: GalleryItem[] = galleryFiles.map((item, index) => ({
  id: String(index + 1),
  title: item.title,
  description: item.description,
  alt: item.alt,
  cta: item.cta,
  href: item.href,
  imageSrc: blockImage(item.file),
}))

export type GallerySectionV6Props = {
  items?: GalleryItem[]
}

export default function GallerySectionV6({
  items = galleryItems,
}: GallerySectionV6Props = {}) {
  return <GallerySectionV6Root items={items} />
}
