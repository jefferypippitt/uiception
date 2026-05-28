import { featureSectionItems } from "../lib/features"
import FeatureCard from "./feature-card"

import "../styles/feature-grid.css"

export default function FeatureGrid() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
      {featureSectionItems.map((item) => (
        <li key={item.id} className="flex min-w-0">
          <FeatureCard item={item} />
        </li>
      ))}
    </ul>
  )
}
