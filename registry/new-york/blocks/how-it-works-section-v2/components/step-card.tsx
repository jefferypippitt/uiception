import { CheckCircle2 } from "lucide-react"

import type { Step } from "../lib/steps"

type Props = {
  step: Step
}

export default function StepCard({ step }: Props) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <h3 className="text-xl leading-snug font-medium tracking-tight text-foreground">
        {step.title}
      </h3>

      <ul className="flex flex-col gap-3">
        {step.features.map((feature, index) => (
          <li
            key={index}
            data-hiw2-feature=""
            className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-foreground stroke-background text-foreground" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
