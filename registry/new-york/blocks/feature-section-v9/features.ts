export type GrainShaderTheme = {
  colors: readonly string[]
  colorBack: string
  softness: number
  intensity: number
  noise: number
  shape:
    | "sphere"
    | "wave"
    | "dots"
    | "truchet"
    | "ripple"
    | "blob"
    | "corners"
  speed: number
  /** Scale tuned in Paper at `designWidth` × `designHeight`. */
  scale?: number
  /** Paper preview width — used to adapt scale when the card is smaller. */
  designWidth?: number
  /** Paper preview height — used to adapt scale when the card is smaller. */
  designHeight?: number
}

export type FeatureIconId = "magnifying-glass" | "pencil" | "handshake" | "shield"

/** Shared shader backdrop — sphere `colors` carry each card's palette. */
export const FSV9_SHADER_COLOR_BACK = "#000000" as const

/** Paper-tuned scale at 1280×720 — larger = sphere fills the card (fullscreen glow). */
export const FSV9_SHADER_DESIGN_SCALE = 8 as const

/** Shared grain animation speed (lower = slower drift). */
export const FSV9_SHADER_SPEED = 0 as const

export const featureSectionEyebrow = "Capabilities"

export const featureSectionTitle = "One platform for every workflow"

export const featureSectionDescription =
  "Four connected modules that share context so your team stays aligned and ships without juggling separate tools."

export type FeatureItem = {
  id: string
  /** 1-based card index shown in the grid (01–04). */
  index: number
  title: string
  description: string
  icon: FeatureIconId
  shader: GrainShaderTheme
}

export const featureSectionItems: FeatureItem[] = [
  {
    id: "explore-priorities",
    index: 1,
    title: "Explore",
    description:
      "Surface signals from your data, compare options side by side, and focus the roadmap on what moves the needle.",
    icon: "magnifying-glass",
    shader: {
      colors: [
        "#022c22",
        "#064e3b",
        "#059669",
        "#34d399",
        "#a7f3d0",
        "#ecfdf5",
      ],
      colorBack: FSV9_SHADER_COLOR_BACK,
      softness: 0.5,
      intensity: 0.5,
      noise: 0.25,
      shape: "sphere",
      speed: FSV9_SHADER_SPEED,
      scale: FSV9_SHADER_DESIGN_SCALE,
      designWidth: 1280,
      designHeight: 720,
    },
  },
  {
    id: "create-ship",
    index: 2,
    title: "Create",
    description:
      "Draft docs, reuse templates, and push updates through review so finished work lands where your team already operates.",
    icon: "pencil",
    shader: {
      colors: [
        "#2e1065",
        "#4c1d95",
        "#7c3aed",
        "#a78bfa",
        "#ddd6fe",
        "#ede9fe",
      ],
      colorBack: FSV9_SHADER_COLOR_BACK,
      softness: 0.5,
      intensity: 0.5,
      noise: 0.25,
      shape: "sphere",
      speed: FSV9_SHADER_SPEED,
      scale: FSV9_SHADER_DESIGN_SCALE,
      designWidth: 1280,
      designHeight: 720,
    },
  },
  {
    id: "align-decide",
    index: 3,
    title: "Align",
    description:
      "Route approvals, capture rationale, and keep stakeholders on the same version before anything goes live.",
    icon: "handshake",
    shader: {
      colors: [
        "#450a0a",
        "#991b1b",
        "#ef4444",
        "#f97316",
        "#fbbf24",
        "#fecaca",
      ],
      colorBack: FSV9_SHADER_COLOR_BACK,
      softness: 0.5,
      intensity: 0.5,
      noise: 0.25,
      shape: "sphere",
      speed: FSV9_SHADER_SPEED,
      scale: FSV9_SHADER_DESIGN_SCALE,
      designWidth: 1280,
      designHeight: 720,
    },
  },
  {
    id: "secure-operate",
    index: 4,
    title: "Secure",
    description:
      "Control access, audit activity, and monitor health across environments so production stays predictable as you scale.",
    icon: "shield",
    shader: {
      colors: [
        "#0f172a",
        "#1e1b4b",
        "#1d4ed8",
        "#3b82f6",
        "#93c5fd",
        "#e0e7ff",
      ],
      colorBack: FSV9_SHADER_COLOR_BACK,
      softness: 0.5,
      intensity: 0.5,
      noise: 0.25,
      shape: "sphere",
      speed: FSV9_SHADER_SPEED,
      scale: FSV9_SHADER_DESIGN_SCALE,
      designWidth: 1280,
      designHeight: 720,
    },
  },
]
