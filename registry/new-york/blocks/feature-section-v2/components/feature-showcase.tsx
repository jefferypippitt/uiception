import { features } from "../lib/features"
import WorkflowIllustration      from "./workflow-illustration"
import AnalyticsIllustration     from "./analytics-illustration"
import AccessControlIllustration from "./access-control-illustration"
import IntegrationsIllustration  from "./integrations-illustration"

export default function FeatureShowcase() {
  return (
    <ul className="fsv2-grid">
      {features.map(({ id, title, description }) => (
        <li key={id} className="fsv2-cell">
          <div className="fsv2-card">
            <div className="fsv2-card-top" aria-hidden="true">
              {id === "workflow-automation" && <WorkflowIllustration      />}
              {id === "real-time-analytics" && <AnalyticsIllustration     />}
              {id === "access-control"      && <AccessControlIllustration />}
              {id === "integrations"        && <IntegrationsIllustration  />}
            </div>
            <div className="fsv2-card-footer">
              <p className="fsv2-card-title">{title}</p>
              <p className="fsv2-card-desc">{description}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
