export type GrainShaderTheme = {
  colors: readonly string[]
  colorBack: string
  accent: string
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
  scale?: number
  designWidth?: number
  designHeight?: number
}

export type TestimonialItem = {
  id: string
  company: string
  name: string
  role: string
  quote: string
  storyHref: string
  avatarFile: string
  shader: GrainShaderTheme
}

export type ResolvedTestimonial = Omit<TestimonialItem, "avatarFile"> & {
  avatarSrc: string
}

export const sectionMeta = {
  title: "Meet the teams we empower",
  description:
    "Trusted by more than 50,000 customers, from ambitious startups to major enterprises.",
  primaryCta: "Contact sales",
  secondaryCta: "Try the product",
} as const

const SHARED = {
  softness: 0.55,
  intensity: 0.45,
  noise: 0.35,
  shape: "sphere" as const,
  speed: 0.4,
  scale: 6,
  designWidth: 480,
  designHeight: 720,
}

export const testimonials: TestimonialItem[] = [
  {
    id: "jane-doe",
    company: "Halcyon Labs",
    name: "Jane Doe",
    role: "VP of Engineering",
    quote:
      "We replaced four internal tools with one workspace and our release train finally runs on schedule every week.",
    storyHref: "#",
    avatarFile: "avatar-1.png",
    shader: {
      ...SHARED,
      colors: ["#7f1d1d", "#be123c", "#fb7185", "#fda4af", "#ffe4e6"],
      colorBack: "#4c0519",
      accent: "#fb7185",
    },
  },
  {
    id: "john-doe",
    company: "Northwind Freight",
    name: "John Doe",
    role: "Director of Operations",
    quote:
      "Dispatch used to run on spreadsheets and phone calls. Now every depot sees the same numbers the moment they change.",
    storyHref: "#",
    avatarFile: "avatar-2.png",
    shader: {
      ...SHARED,
      colors: ["#7c2d12", "#c2410c", "#fb923c", "#fdba74", "#ffedd5"],
      colorBack: "#431407",
      accent: "#fb923c",
    },
  },
  {
    id: "jane-smith",
    company: "Cadence Health",
    name: "Jane Smith",
    role: "Chief Product Officer",
    quote:
      "Our clinical teams shipped three patient-facing features last quarter without ever filing a ticket with engineering.",
    storyHref: "#",
    avatarFile: "avatar-3.png",
    shader: {
      ...SHARED,
      colors: ["#14532d", "#15803d", "#4ade80", "#86efac", "#dcfce7"],
      colorBack: "#052e16",
      accent: "#4ade80",
    },
  },
  {
    id: "john-smith",
    company: "Basalt Robotics",
    name: "John Smith",
    role: "Head of Autonomy",
    quote:
      "Fleet telemetry that used to take a day to reconcile now lands in seconds, so we catch drift before it reaches the floor.",
    storyHref: "#",
    avatarFile: "avatar-4.png",
    shader: {
      ...SHARED,
      colors: ["#1e3a8a", "#1d4ed8", "#60a5fa", "#93c5fd", "#dbeafe"],
      colorBack: "#172554",
      accent: "#60a5fa",
    },
  },
  {
    id: "alex-johnson",
    company: "Lumen Ledger",
    name: "Alex Johnson",
    role: "Staff Data Engineer",
    quote:
      "Audit season went from six weeks of manual reconciliation to a single afternoon, and nothing had to be rebuilt.",
    storyHref: "#",
    avatarFile: "avatar-5.png",
    shader: {
      ...SHARED,
      colors: ["#581c87", "#7e22ce", "#c084fc", "#d8b4fe", "#f3e8ff"],
      colorBack: "#3b0764",
      accent: "#c084fc",
    },
  },
  {
    id: "sam-wilson",
    company: "Kestrel Retail",
    name: "Sam Wilson",
    role: "SVP of Digital",
    quote:
      "Store managers adopted it in a weekend. Support volume dropped by a third before we finished the rollout.",
    storyHref: "#",
    avatarFile: "avatar-6.png",
    shader: {
      ...SHARED,
      colors: ["#134e4a", "#0f766e", "#2dd4bf", "#5eead4", "#ccfbf1"],
      colorBack: "#042f2e",
      accent: "#2dd4bf",
    },
  },
]
