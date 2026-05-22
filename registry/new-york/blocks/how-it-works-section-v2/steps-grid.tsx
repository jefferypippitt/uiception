"use client"

import type { ReactNode } from "react"
import { useRef } from "react"

import { Badge } from "@/components/ui/badge"

import { useHiw2V2Animations } from "./use-hiw2-v2-animations"
import { STEP_LABEL_BADGE_VARIANT, steps } from "./steps"
import StepCard from "./step-card"

type StepsGridProps = {
  title: ReactNode
}

export default function StepsGrid({ title }: StepsGridProps) {
  const titleRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useHiw2V2Animations({
    title: titleRef,
    cards: cardRefs,
  })

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div ref={titleRef} className="mb-12 md:mb-16">
        {title}
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
        {steps.map((step, i) => (
          <div
            key={step.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
          >
            <Badge variant={STEP_LABEL_BADGE_VARIANT} className="uppercase">
              {step.label}
            </Badge>

            <StepCard step={step} />
          </div>
        ))}
      </div>
    </div>
  )
}
