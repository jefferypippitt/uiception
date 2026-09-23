export const caseStudy = {
  title: "How we rebuilt Acme's checkout.",
  summary:
    "Acme's checkout was spread across nine legacy pages, each with its own form styles. We rebuilt it as one flow on a shared component library that their team now maintains.",
  imageFile: "image-1.jpg",
  alt: "A brand mark on a soft gray background surrounded by paper shapes",
  href: "#",
  linkLabel: "View the project",
} as const

export type Metric = {
  id: string
  value: string
  label: string
}

export const metrics: Metric[] = [
  { id: "checkout", value: "38%", label: "Fewer abandoned checkouts" },
  { id: "timeline", value: "6 weeks", label: "From kickoff to launch" },
  { id: "speed", value: "2.4×", label: "Faster page loads" },
]
