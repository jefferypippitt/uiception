import { featureSectionItems } from "../lib/features"

import "../styles/feature-grid.css"

export default function FeatureGrid() {
  return (
    <ul className="fsv1-grid">
      {featureSectionItems.map(({ id, title, description, index, Icon }) => (
        <li key={id} className="fsv1-cell">
          <div className="fsv1-card">
            <div className="fsv1-card-front">
              <Icon className="fsv1-card-icon" />
              <p className="fsv1-card-title">{title}</p>
            </div>
            <div className="fsv1-card-back">
              <p className="fsv1-card-desc">{description}</p>
            </div>
          </div>
          <p className="fsv1-index">[{index.toString().padStart(2, "0")}]</p>
        </li>
      ))}
    </ul>
  )
}
