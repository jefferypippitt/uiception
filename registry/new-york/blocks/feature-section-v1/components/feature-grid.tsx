"use client"

import { useFeatureAnimation } from "../hooks/use-feature-animation"
import { features } from "../lib/features"
import FeatureCard from "./feature-card"

export default function FeatureGrid() {
  const { ref, isVisible } = useFeatureAnimation()

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:grid-rows-2"
    >
      {features.map((feature, i) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          index={i}
          isVisible={isVisible}
        />
      ))}
    </div>
  )
}
