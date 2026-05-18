/** Shared ink palette — colors stay identical on every card. */
export const FSV6_MESH_COLORS = ["#ffffff", "#000000"] as const

export const FSV6_MESH_SPEED = 0.22

export type FeatureShaderTheme = {
  swirl: number
  rotation: number
  distortion: number
  scale: number
  offsetX: number
  offsetY: number
  /** Stagger animation phase so tiles do not mirror each other. */
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
      "Let routine tasks run themselves so your team can focus on work that actually changes outcomes.",
    shader: {
      swirl: 0.04,
      rotation: 0,
      distortion: 0.5,
      scale: 0.34,
      offsetX: 0.35,
      offsetY: -0.2,
      frame: 0,
    },
  },
  {
    id: "deep-analytics",
    title: "See what matters",
    description:
      "See what is working, what is slipping, and where to focus next without wading through noise.",
    shader: {
      swirl: 0.92,
      rotation: 58,
      distortion: 1.2,
      scale: 0.19,
      offsetX: -0.4,
      offsetY: 0.35,
      frame: 18_500,
    },
  },
  {
    id: "team-collaboration",
    title: "Stay aligned together",
    description:
      "Share context with live updates and make decisions in one place your whole team can trust.",
    shader: {
      swirl: 0.48,
      rotation: 165,
      distortion: 0.72,
      scale: 0.27,
      offsetX: 0.15,
      offsetY: 0.45,
      frame: 41_000,
    },
  },
  {
    id: "instant-performance",
    title: "Stay fast at scale",
    description:
      "Start with a responsive baseline on day one and keep headroom as traffic and complexity grow.",
    shader: {
      swirl: 1,
      rotation: 248,
      distortion: 1.05,
      scale: 0.16,
      offsetX: -0.25,
      offsetY: -0.42,
      frame: 67_500,
    },
  },
]
