"use client"

import { GeistMono } from "geist/font/mono"

import { features } from "../lib/features"
import {
  Fsv3IllustrationActiveProvider,
  useFsv3IllustrationBlockGate,
} from "../hooks/use-fsv3-illustration-active"
import DropoffIllustration from "./dropoff-illustration"
import ExperimentIllustration from "./experiment-illustration"
import FunnelIllustration from "./funnel-illustration"

function IllustrationForId({ id }: { id: string }) {
  switch (id) {
    case "funnel-opportunities":
      return <FunnelIllustration />
    case "dropoff-diagnosis":
      return <DropoffIllustration />
    case "experiment-impact":
      return <ExperimentIllustration />
    default:
      return null
  }
}

export default function FeatureShowcase() {
  const { ref, active } = useFsv3IllustrationBlockGate()

  return (
    <Fsv3IllustrationActiveProvider active={active}>
      <ul ref={ref} className="fsv3-grid">
        {features.map(({ id, step, title, description }) => (
          <li key={id} className="fsv3-cell">
            <div className="fsv3-card">
              <div className="fsv3-card-top" aria-hidden="true">
                <IllustrationForId id={id} />
              </div>
              <div className="fsv3-card-footer">
                <p className={`${GeistMono.className} fsv3-card-step`}>{step}</p>
                <p className="fsv3-card-title">{title}</p>
                <p className="fsv3-card-desc">{description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Fsv3IllustrationActiveProvider>
  )
}
