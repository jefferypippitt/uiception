import type { ComponentType } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AccessControlIllustration from "./access-control-illustration"
import { FeatureCardMedia } from "./feature-card-media"
import IntegrationsIllustration from "./integrations-illustration"
import RealTimeAnalyticsIllustration from "./real-time-analytics-illustration"
import WorkflowAutomationIllustration from "./workflow-automation-illustration"
import { features, type FeatureIllustrationId } from "./features"

const illustrationComponents: Record<FeatureIllustrationId, ComponentType> = {
  "workflow-automation": WorkflowAutomationIllustration,
  "real-time-analytics": RealTimeAnalyticsIllustration,
  "access-control": AccessControlIllustration,
  integrations: IntegrationsIllustration,
}

export default function FeatureShowcase() {
  return (
    <ul className="mx-auto m-0 grid max-w-3xl list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
      {features.map(({ id, title, description, illustration }) => {
        const Illustration = illustrationComponents[illustration]

        return (
          <li key={id} className="flex min-w-0">
            <Card
              size="sm"
              className="group/card flex w-full flex-col gap-0 overflow-hidden rounded-lg py-0 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <FeatureCardMedia>
                <Illustration />
              </FeatureCardMedia>
              <CardHeader className="gap-0.5 px-3 pt-2 pb-0">
                <CardTitle className="font-mono text-[0.625rem] leading-[1.25] font-medium tracking-[0.1em] text-foreground/90 uppercase">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pt-1 pb-2.5">
                <CardDescription className="m-0 line-clamp-3 text-[0.75rem] leading-[1.4]">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
