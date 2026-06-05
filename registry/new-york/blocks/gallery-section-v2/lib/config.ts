const blockImage = (filename: string) =>
  `https://uiception.com/images/blocks/gallery-section-v2/${filename}`

export type GalleryItem = {
  id: string
  title: string
  description: string
  imageSrc: string
  alt: string
  blurDataURL?: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Aron Visuals",
    description: "Mountain landscape at golden hour",
    imageSrc: blockImage("image-1.jpg"),
    alt: "Mountain landscape at golden hour",
  },
  {
    id: "2",
    title: "Boudhayan Bardhan",
    description: "Coastal cliffs and ocean waves",
    imageSrc: blockImage("image-2.jpg"),
    alt: "Coastal cliffs and ocean waves",
  },
  {
    id: "3",
    title: "Etienne Bosiger",
    description: "Forest trail through tall trees",
    imageSrc: blockImage("image-3.jpg"),
    alt: "Forest trail through tall trees",
  },
  {
    id: "4",
    title: "Filip Zrnzevic",
    description: "City skyline at dusk",
    imageSrc: blockImage("image-4.jpg"),
    alt: "City skyline at dusk",
  },
  {
    id: "5",
    title: "Ivana Cajina",
    description: "Desert dunes under a clear sky",
    imageSrc: blockImage("image-5.jpg"),
    alt: "Desert dunes under a clear sky",
  },
  {
    id: "6",
    title: "Justin Clark",
    description: "Snow-capped peaks above a valley",
    imageSrc: blockImage("image-6.jpg"),
    alt: "Snow-capped peaks above a valley",
  },
  {
    id: "7",
    title: "Meghan Schiereck",
    description: "Lush green hills and farmland",
    imageSrc: blockImage("image-7.jpg"),
    alt: "Lush green hills and farmland",
  },
  {
    id: "8",
    title: "Michael Baccin",
    description: "Rocky shoreline at sunset",
    imageSrc: blockImage("image-8.jpg"),
    alt: "Rocky shoreline at sunset",
  },
  {
    id: "9",
    title: "Quentin",
    description: "Misty lake surrounded by mountains",
    imageSrc: blockImage("image-9.jpg"),
    alt: "Misty lake surrounded by mountains",
  },
]
