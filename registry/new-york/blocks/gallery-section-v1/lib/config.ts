const blockImage = (filename: string) =>
  `https://uiception.com/images/blocks/gallery-section-v1/${filename}`

export type GalleryItem = {
  id: string
  label: string
  alt: string
  imageSrc: string
}

export const sectionMeta = {
  title: "Moments In Focus",
}

export const imageFiles = [
  { file: blockImage("image-1.jpg"),  alt: "Mountain landscape at golden hour" },
  { file: blockImage("image-2.jpg"),  alt: "Coastal cliffs and ocean waves" },
  { file: blockImage("image-3.jpg"),  alt: "Forest trail through tall trees" },
  { file: blockImage("image-4.jpg"),  alt: "City skyline at dusk" },
  { file: blockImage("image-5.jpg"),  alt: "Desert dunes under a clear sky" },
  { file: blockImage("image-6.jpg"),  alt: "Snow-capped peaks above a valley" },
  { file: blockImage("image-7.jpg"),  alt: "Lush green hills and farmland" },
  { file: blockImage("image-8.jpg"),  alt: "Rocky shoreline at sunset" },
  { file: blockImage("image-9.jpg"),  alt: "Misty lake surrounded by mountains" },
  { file: blockImage("image-10.jpg"), alt: "Cherry blossoms in spring light" },
]
