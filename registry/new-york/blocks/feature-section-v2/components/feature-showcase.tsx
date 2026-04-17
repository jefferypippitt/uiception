"use client"

import { features } from "../lib/features"
import {
  Fsv2IllustrationActiveProvider,
  useFsv2IllustrationBlockGate,
} from "../hooks/use-fsv2-illustration-active"
import WorkflowIllustration from "./workflow-illustration"
import AnalyticsIllustration from "./analytics-illustration"
import AccessControlIllustration from "./access-control-illustration"
import IntegrationsIllustration from "./integrations-illustration"

/** Maps feature id → illustration — chart-led analytics, pipeline, IAM table, topology edges. */
function IllustrationForId({ id }: { id: string }) {
  switch (id) {
    case "workflow-automation":
      return <WorkflowIllustration />
    case "real-time-analytics":
      return <AnalyticsIllustration />
    case "access-control":
      return <AccessControlIllustration />
    case "integrations":
      return <IntegrationsIllustration />
    default:
      return null
  }
}

export default function FeatureShowcase() {
  const { ref, active } = useFsv2IllustrationBlockGate()

  return (
    <Fsv2IllustrationActiveProvider active={active}>
      <ul ref={ref} className="fsv2-grid">
        {features.map(({ id, title, description }) => (
          <li key={id} className="fsv2-cell">
            <div className="fsv2-card">
              <div className="fsv2-card-top" aria-hidden="true">
                <IllustrationForId id={id} />
              </div>
              <div className="fsv2-card-footer">
                <p className="fsv2-card-title">{title}</p>
                <p className="fsv2-card-desc">{description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Fsv2IllustrationActiveProvider>
  )
}
