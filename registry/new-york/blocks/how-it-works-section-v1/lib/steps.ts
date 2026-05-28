export type Step = {
  id: string
  number: string
  title: string
  description: string
}

export const steps: Step[] = [
  {
    id: "browse",
    number: "01",
    title: "Browse",
    description:
      "Explore a growing library of UI blocks built with Next.js, Tailwind CSS, and shadcn/ui. Find the right one and you are halfway there.",
  },
  {
    id: "copy",
    number: "02",
    title: "Copy",
    description:
      "Paste the code straight into your project. No installs, no wrappers and no lock in. Just clean components that you fully own.",
  },
  {
    id: "ship",
    number: "03",
    title: "Ship",
    description:
      "Every block is styled, responsive and ready to go. Take your idea straight to production without writing a single line of boilerplate.",
  },
]
