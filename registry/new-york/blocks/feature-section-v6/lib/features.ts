
export const FSV6_WARP_COLORS = [
  "#000000",
  "#ffffff",
  "#000000",
  "#ffffff",
] as const

export const FSV6_WARP = {
  proportion: 0.5,
  softness: 1,
  distortion: 0.09,
  swirl: 0.9,
  swirlIterations: 6,
  shape: "checks" as const,
  shapeScale: 0.25,
  speed: 3,
  scale: 2.5,
  rotation: 1.35,
}

export type FeatureShaderTheme = {
  offsetX: number
  offsetY: number

  frame: number
}

export type FeatureDefinition = {
  id: string
  title: string
  description: string
  shader: FeatureShaderTheme
}

export const featureSectionItems: FeatureDefinition[] = [
  {
    id: "smart-automation",
    title: "Automate the repeatable",
    description:
      "Hand off routine work so your team can focus on decisions that shape outcomes.",
    shader: {
      offsetX: 0.35,
      offsetY: -0.2,
      frame: 0,
    },
  },
  {
    id: "deep-analytics",
    title: "See what matters",
    description:
      "Know what's working, what's slipping, and where to act next without digging through noise.",
    shader: {
      offsetX: -0.4,
      offsetY: 0.35,
      frame: 18_500,
    },
  },
  {
    id: "team-collaboration",
    title: "Keep everyone aligned",
    description:
      "Live updates put the same context in front of everyone, so decisions land fast instead of in scattered threads.",
    shader: {
      offsetX: 0.15,
      offsetY: 0.45,
      frame: 41_000,
    },
  },
  {
    id: "instant-performance",
    title: "Stay fast at scale",
    description:
      "Ship responsive from day one and retain room to grow as traffic and product scope increase.",
    shader: {
      offsetX: -0.25,
      offsetY: -0.42,
      frame: 67_500,
    },
  },
]
