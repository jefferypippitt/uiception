export type GalleryItem = {
  id: string
  label: string
  alt: string
  imageSrc: string
}

export const sectionMeta = {
  title: "Moments In Focus",
}

// Raw file list — imageSrc is constructed in gallery-section-v1.tsx
export const imageFiles = [
  {
    file: "aron-visuals-LSFuPFE9vKE-unsplash.jpg",
    alt: "Mountain landscape at golden hour",
  },
  {
    file: "boudhayan-bardhan-60tataLkJ0U-unsplash.jpg",
    alt: "Coastal cliffs and ocean waves",
  },
  {
    file: "etienne-bosiger-OWsdJ-MllYA-unsplash.jpg",
    alt: "Forest trail through tall trees",
  },
  {
    file: "filip-zrnzevic-_EMkxLdko9k-unsplash.jpg",
    alt: "City skyline at dusk",
  },
  {
    file: "ivana-cajina-9LwCEYH1oW4-unsplash.jpg",
    alt: "Desert dunes under a clear sky",
  },
  {
    file: "justin-clark-H7JiEU8Slnw-unsplash.jpg",
    alt: "Snow-capped peaks above a valley",
  },
  {
    file: "meghan-schiereck-E_j8FgQxo88-unsplash.jpg",
    alt: "Lush green hills and farmland",
  },
  {
    file: "michael-baccin-Cv5ooHwI2DQ-unsplash.jpg",
    alt: "Rocky shoreline at sunset",
  },
  {
    file: "quentin-zwzeorQPepo-unsplash.jpg",
    alt: "Misty lake surrounded by mountains",
  },
  {
    file: "yoshi-takekawa-7wk0ja-DP_c-unsplash.jpg",
    alt: "Cherry blossoms in spring light",
  },
] as const
