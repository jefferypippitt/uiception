"use client"

import { featureColumns } from "./config"
import FeatureCard from "./feature-card"
import { useInViewOnce } from "./use-in-view-once"

export default function FeatureGrid() {
  const { ref, active } = useInViewOnce(0.2)

  return (
    <div ref={ref} className="mx-auto max-w-5xl border border-border">
      <ul className="m-0 grid list-none grid-cols-1 p-0 md:grid-cols-2 lg:grid-cols-[2fr_3fr]">
        {featureColumns.slice(0, 2).map((column, index) => (
          <FeatureCard key={column.id} column={column} index={index} live={active} />
        ))}
      </ul>
      <ul className="m-0 grid list-none grid-cols-1 border-t border-border p-0 md:grid-cols-2 lg:grid-cols-[2fr_3fr]">
        {featureColumns.slice(2).map((column, index) => (
          <FeatureCard
            key={column.id}
            column={column}
            index={index}
            live={active}
            className="-mt-px"
          />
        ))}
      </ul>
    </div>
  )
}
