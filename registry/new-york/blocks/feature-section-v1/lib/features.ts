import type { ComponentType, SVGProps } from "react"

import {
  IconBrain,
  IconGitMerge,
  IconLightning,
  IconMagnifier,
  IconPlug,
  IconShield,
} from "../components/feature-icons"

export type FeatureDefinition = {
  id: string
  title: string
  description: string
  index: number
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const featureSectionItems: FeatureDefinition[] = [
  {
    id: "smart-automation",
    title: "Smart automation",
    description:
      "Stop wasting time on tasks your tools should be handling. We help you automate the boring parts so your team can spend their energy on work that actually makes a difference.",
    index: 1,
    Icon: IconBrain,
  },
  {
    id: "deep-analytics",
    title: "Deep analytics",
    description:
      "Gut feeling is great, but data is better. Get a clear picture of what is driving results, where things are slipping, and what your team should be paying attention to right now.",
    index: 2,
    Icon: IconMagnifier,
  },
  {
    id: "team-collaboration",
    title: "Team collaboration",
    description:
      "Nobody likes being out of the loop. Keep your whole team aligned with shared workflows, real-time updates, and one place where decisions actually get made.",
    index: 3,
    Icon: IconGitMerge,
  },
  {
    id: "instant-performance",
    title: "Instant performance",
    description:
      "Slow software costs you users. Everything we build is optimized to be fast from day one, and it stays that way as your traffic grows and your product gets more complex.",
    index: 4,
    Icon: IconLightning,
  },
  {
    id: "100-integrations",
    title: "100+ integrations",
    description:
      "Your team already has tools they love. We connect with over a hundred of them so you can plug us in without changing how you work or asking engineering for a favor.",
    index: 5,
    Icon: IconPlug,
  },
  {
    id: "secure-by-default",
    title: "Secure by default",
    description:
      "Security should not be an afterthought. We built it into the foundation so you are covered from the start, whether you are a two-person startup or a team of thousands.",
    index: 6,
    Icon: IconShield,
  },
]
