export const STEP_LABEL_BADGE_VARIANT = "outline" as const

export type StepFeature = string

export type Step = {
  id: string
  label: string
  title: string
  features: StepFeature[]
}

export const steps: Step[] = [
  {
    id: "step-1",
    label: "Step 1",
    title: "Create your project",
    features: [
      "Scaffold a new Next.js app with a single command",
      "Choose Tailwind CSS and App Router when prompted",
      "TypeScript support included out of the box",
    ],
  },
  {
    id: "step-2",
    label: "Step 2",
    title: "Initialize shadcn/ui",
    features: [
      "Run the shadcn CLI to configure your project",
      "Sets up components.json with your preferred style",
      "Adds the necessary Tailwind and import alias config",
    ],
  },
  {
    id: "step-3",
    label: "Step 3",
    title: "Add components",
    features: [
      "Install only the components you actually need",
      "Code is copied directly into your project",
      "Fully customizable — no black-box dependencies",
    ],
  },
]
