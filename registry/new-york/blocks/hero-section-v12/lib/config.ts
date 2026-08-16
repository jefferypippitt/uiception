export type HeroSlideFile = {
  file: string
  alt: string
}

/** Milliseconds between autoplay slide advances. */
export const AUTOPLAY_MS = 5000

export const headline = "Brand systems that look intentional on every surface."

export const title = "Acme Corp. for product teams"

export const body =
  "Keep posters, packaging comps, and launch decks in one shared kit. Swap art direction once and every asset stays on-brand without rebuilding the deck from scratch."

export const primaryCta = {
  label: "Browse kits",
  href: "#",
} as const

export const secondaryCta = {
  label: "Book a walkthrough",
  href: "#",
} as const

export const slideFiles: HeroSlideFile[] = [
  {
    file: "image-1.jpg",
    alt: "Bakery poster stacking four filled doughnuts beneath bold 'Dusted Filled' display type",
  },
  {
    file: "image-2.jpg",
    alt: "Night Owl cold brew bottle poster set against bold 'Awake' display type",
  },
  {
    file: "image-3.jpg",
    alt: "Reissued Leica M6 film camera poster titled 'Grain' on a grayscale gradient",
  },
  {
    file: "image-4.jpg",
    alt: "Mechanical keyboard poster titled 'Clack' on a cool gray backdrop",
  },
  {
    file: "image-5.jpg",
    alt: "Rose gold safety razor poster titled 'Smooth' over layered serif type",
  },
  {
    file: "image-6.jpg",
    alt: "Lavender sleep mist bottle poster titled 'Exhale' on a lilac background",
  },
]
