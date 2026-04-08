import { CheckCircle2 } from "lucide-react"

import type { Step } from "../lib/steps"

type Props = {
  step: Step
}

export default function StepCard({ step }: Props) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <h3 className="text-xl font-medium tracking-tight leading-snug text-foreground">
        {step.title}
      </h3>

      <ul className="flex flex-col gap-3">
        {step.features.map((feature, index) => (
          <li
            key={index}
            data-hiw2-feature=""
            className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
          >
            <CheckCircle2 className="hiw2-check-icon h-4 w-4 fill-foreground stroke-background" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
