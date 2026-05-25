export type FeatureSectionContent = {
  title: string
}

export const featureSectionContent: FeatureSectionContent = {
  title: "Core capabilities for modern operations",
}

export type FeatureColumnLayout = "reversed" | "default"

export type FeaturePreviewSize = "compact" | "default" | "large" | "tall"

export type FeatureColumn = {
  id: string
  title: string
  description: string
  layout?: FeatureColumnLayout
  previewSize?: FeaturePreviewSize
}

export const featurePreviewMinHeights: Record<FeaturePreviewSize, string> = {
  compact: "min-h-24 sm:min-h-28 lg:min-h-32",
  default: "min-h-36 sm:min-h-40 lg:min-h-44",
  large: "min-h-40 sm:min-h-44 lg:min-h-52",
  tall: "min-h-48 sm:min-h-56 lg:min-h-64",
}

export const featureColumns: FeatureColumn[] = [
  {
    id: "real-time-execution",
    title: "Real-time execution",
    description:
      "Watch runs as they fire, read stage delay in seconds, and spot slowdowns before they reach customers.",
    layout: "reversed",
  },
  {
    id: "workflow-orchestration",
    title: "Workflow orchestration",
    description:
      "Chain steps across services, fan out events to downstream handlers, and see throughput on one canvas.",
    previewSize: "large",
  },
  {
    id: "pipeline-health",
    title: "Pipeline health",
    description:
      "Inspect backlog size, reliability curves, and choke points so delivery stays steady before incidents escalate.",
    layout: "reversed",
    previewSize: "tall",
  },
  {
    id: "task-automation",
    title: "Scheduled jobs",
    description:
      "Set cron-style schedules, assign owners, and scan upcoming handoffs in a single roster view.",
    previewSize: "tall",
  },
]
