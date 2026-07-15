export type GalleryItem = {
  id: string
  title: string
  description: string
  price: string
  imageSrc: string
  alt: string
}

export const sectionMeta = {
  title: "Painting Gallery",
  description:
    "Original works on canvas and paper",
} as const

export const galleryFiles = [
  {
    file: "image-1.jpg",
    title: "Morning harbor",
    description: "Oil on linen, 36 × 48 in",
    price: "$4,800",
    alt: "Oil painting of a morning harbor",
  },
  {
    file: "image-2.jpg",
    title: "Field study no. 7",
    description: "Acrylic on panel, 18 × 24 in",
    price: "$1,250",
    alt: "Acrylic field study painting",
  },
  {
    file: "image-3.jpg",
    title: "Quiet interior",
    description: "Oil on canvas, 24 × 30 in",
    price: "$2,900",
    alt: "Oil painting of a quiet interior",
  },
  {
    file: "image-4.jpg",
    title: "Coastal light",
    description: "Watercolor on paper, 12 × 16 in",
    price: "$780",
    alt: "Watercolor of coastal light",
  },
  {
    file: "image-5.jpg",
    title: "Autumn orchard",
    description: "Oil on canvas, 40 × 40 in",
    price: "$6,200",
    alt: "Oil painting of an autumn orchard",
  },
] as const
