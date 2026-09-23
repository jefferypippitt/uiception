export type GalleryItem = {
  id: string
  title: string
  description: string
  imageSrc: string
  alt: string
  cta: string
  href: string
}

export const galleryFiles = [
  {
    file: "image-1.jpg",
    title: "Morning harbor",
    description: "Oil on linen, 36 × 48 in",
    alt: "Oil painting of a morning harbor",
    cta: "Learn more",
    href: "#",
  },
  {
    file: "image-2.jpg",
    title: "Field study no. 7",
    description: "Acrylic on panel, 18 × 24 in",
    alt: "Acrylic field study painting",
    cta: "Learn more",
    href: "#",
  },
  {
    file: "image-3.jpg",
    title: "Quiet interior",
    description: "Oil on canvas, 24 × 30 in",
    alt: "Oil painting of a quiet interior",
    cta: "Learn more",
    href: "#",
  },
  {
    file: "image-4.jpg",
    title: "Coastal light",
    description: "Watercolor on paper, 12 × 16 in",
    alt: "Watercolor of coastal light",
    cta: "Learn more",
    href: "#",
  },
  {
    file: "image-5.jpg",
    title: "Autumn orchard",
    description: "Oil on canvas, 40 × 40 in",
    alt: "Oil painting of an autumn orchard",
    cta: "Learn more",
    href: "#",
  },
] as const
