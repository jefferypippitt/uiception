"use client"

import { useState } from "react"

import {
  featureSectionItems,
  featureSectionTitle,
  type FeatureIconId,
} from "../lib/features"
import { useHoverIntent } from "../hooks/use-hover-intent"
import FeatureCard from "./feature-card"
import FeaturePanel from "./feature-panel"

export default function FeatureShowcase() {
  const [activeIcon, setActiveIcon] = useState<FeatureIconId>(
    featureSectionItems[0]?.icon ?? "flow"
  )
  const { schedule, commit } = useHoverIntent(setActiveIcon)

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <header className="max-w-2xl">
        <h2 className="m-0 text-2xl font-medium leading-snug tracking-[-0.02em] text-balance sm:text-3xl sm:leading-[1.2] lg:text-[2rem] lg:leading-[1.2]">
          {featureSectionTitle}
        </h2>
      </header>

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10">
        <ul className="m-0 flex min-w-0 list-none flex-col gap-2.5 p-0 sm:gap-3">
          {featureSectionItems.map((item) => (
            <li key={item.id} className="m-0 p-0">
              <FeatureCard
                item={item}
                active={activeIcon === item.icon}
                onHoverIntent={() => schedule(item.icon)}
                onActivate={() => commit(item.icon)}
              />
            </li>
          ))}
        </ul>

        <div className="min-w-0 w-full">
          <FeaturePanel activeIcon={activeIcon} />
        </div>
      </div>
    </div>
  )
}
