import { featureSectionItems } from "../lib/features"

import "../styles/feature-grid.css"

export default function FeatureGrid() {
  return (
    <ul className="fsv5-grid">
      {featureSectionItems.map(({ id, title, description }) => (
        <li key={id} className="fsv5-cell">
          <div className="fsv5-card">
            <p className="fsv5-card-title">{title}</p>
            <p className="fsv5-card-desc">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
