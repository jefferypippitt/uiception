export type FeatureIconId = "flow" | "branch" | "signal" | "secure"

export const featureSectionTitle = "Get work done without the clutter"

export const featureIllustrationViewBoxes: Record<FeatureIconId, string> = {
  flow: "0 0 480 360",
  branch: "0 0 480 360",
  signal: "0 0 480 360",
  secure: "0 0 480 360",
}

export type FeatureItem = {
  id: string
  title: string
  description: string
  icon: FeatureIconId
}

export const featureSectionItems: FeatureItem[] = [
  {
    id: "one-source-of-truth",
    title: "Everything in one place",
    description:
      "Bring related work into a single shared space so you stop hunting across tabs and tools.",
    icon: "flow",
  },
  {
    id: "work-in-parallel",
    title: "Try more than one path",
    description:
      "Explore options side by side, then keep what works and leave the rest behind.",
    icon: "branch",
  },
  {
    id: "stay-in-the-loop",
    title: "Only the updates that matter",
    description:
      "Hear from the product when something needs you, and stay quiet when nothing does.",
    icon: "signal",
  },
  {
    id: "secure-by-default",
    title: "Clear control over access",
    description:
      "Decide who can see and change what, with permissions that are easy to set and easy to explain.",
    icon: "secure",
  },
]
