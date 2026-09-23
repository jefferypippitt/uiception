export type GalleryItem = {
  id: string
  imageSrc: string
  alt: string
}

export const sectionMeta = {
  title: "Always something new on the easel",
  description:
    "Recent canvases and paper studies drift past one by one.",
} as const

/** Cards spaced evenly around the full ring — items repeat to fill every slot. */
export const RING_SLOTS = 20

export const galleryFiles = [
  { file: "image-1.jpg", alt: "Oil painting of a morning harbor" },
  { file: "image-2.jpg", alt: "Acrylic field study painting" },
  { file: "image-3.jpg", alt: "Oil painting of a quiet interior" },
  { file: "image-4.jpg", alt: "Watercolor of coastal light" },
  { file: "image-5.jpg", alt: "Oil painting of an autumn orchard" },
] as const
