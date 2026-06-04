import type { ImageProps } from "next/image"

import aron from "@/public/images/blocks/gallery-section-v1/aron-visuals-LSFuPFE9vKE-unsplash.jpg"
import boudhayan from "@/public/images/blocks/gallery-section-v1/boudhayan-bardhan-60tataLkJ0U-unsplash.jpg"
import etienne from "@/public/images/blocks/gallery-section-v1/etienne-bosiger-OWsdJ-MllYA-unsplash.jpg"
import filip from "@/public/images/blocks/gallery-section-v1/filip-zrnzevic-_EMkxLdko9k-unsplash.jpg"
import ivana from "@/public/images/blocks/gallery-section-v1/ivana-cajina-9LwCEYH1oW4-unsplash.jpg"
import justin from "@/public/images/blocks/gallery-section-v1/justin-clark-H7JiEU8Slnw-unsplash.jpg"
import meghan from "@/public/images/blocks/gallery-section-v1/meghan-schiereck-E_j8FgQxo88-unsplash.jpg"
import michael from "@/public/images/blocks/gallery-section-v1/michael-baccin-Cv5ooHwI2DQ-unsplash.jpg"
import quentin from "@/public/images/blocks/gallery-section-v1/quentin-zwzeorQPepo-unsplash.jpg"
import yoshi from "@/public/images/blocks/gallery-section-v1/yoshi-takekawa-7wk0ja-DP_c-unsplash.jpg"

export type GalleryItem = {
  id: string
  label: string
  alt: string
  imageSrc: ImageProps["src"]
}

export const sectionMeta = {
  title: "Moments In Focus",
}

export const imageFiles = [
  { file: aron,      alt: "Mountain landscape at golden hour" },
  { file: boudhayan, alt: "Coastal cliffs and ocean waves" },
  { file: etienne,   alt: "Forest trail through tall trees" },
  { file: filip,     alt: "City skyline at dusk" },
  { file: ivana,     alt: "Desert dunes under a clear sky" },
  { file: justin,    alt: "Snow-capped peaks above a valley" },
  { file: meghan,    alt: "Lush green hills and farmland" },
  { file: michael,   alt: "Rocky shoreline at sunset" },
  { file: quentin,   alt: "Misty lake surrounded by mountains" },
  { file: yoshi,     alt: "Cherry blossoms in spring light" },
] as const
