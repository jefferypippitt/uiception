import { featureSectionItems } from "../lib/features"

import { FeatureSectionV6MeshBg } from "./feature-section-v6-mesh-bg"

import "../styles/feature-grid.css"

export default function FeatureGrid() {
  return (
    <ul className="fsv6-grid">
      {featureSectionItems.map(({ id, title, description, shader }) => (
        <li key={id} className="fsv6-cell">
          <div className="fsv6-card">
            <FeatureSectionV6MeshBg {...shader} />
            <div className="fsv6-card-scrim" aria-hidden />
            <div className="fsv6-card-content">
              <h3 className="fsv6-card-title">{title}</h3>
              <p className="fsv6-card-desc">{description}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
