export type HeroV9Cta = {
  label: string
  href: string
}

export type PreviewStatusState = "success" | "running" | "waiting"

export type HeroV9Content = {
  title: string
  description: string
  primaryCta: HeroV9Cta
  secondaryCta: HeroV9Cta
}

export type ProductPreviewConfig = {
  metrics: ReadonlyArray<{ value: string; label: string }>
  panels: {
    activity: {
      title: string
      bars: ReadonlyArray<number>
    }
    tasks: {
      legendTitle: string
      legend: ReadonlyArray<{ label: string; state: PreviewStatusState }>
      tableTitle: string
      rows: ReadonlyArray<{
        automation: string
        status: string
        lastRun: string
        state: PreviewStatusState
      }>
    }
  }
}

export const heroV9Content: HeroV9Content = {
  title: "Visual Automation for Modern Teams",
  description:
    "Design playbooks once, schedule recurring work, and keep every operation visible in one place.",
  primaryCta: { label: "View pricing", href: "#" },
  secondaryCta: { label: "Join waitlist", href: "#" },
}

export const heroV9Preview: ProductPreviewConfig = {
  metrics: [
    { value: "12.4K", label: "Runs completed" },
    { value: "98.9%", label: "Success rate" },
    { value: "1.5 Min", label: "Avg. duration" },
    { value: "28", label: "Queued jobs" },
  ],
  panels: {
    activity: {
      title: "Run volume",
      bars: [
        42, 68, 55, 88, 72, 95, 60, 78, 50, 82, 65, 90, 58, 74, 63, 85, 70,
        92, 48, 80, 67, 86, 52, 76, 61, 94, 45, 83, 69, 91, 56, 79, 64, 87,
        53, 81, 66, 89, 47, 77,
      ],
    },
    tasks: {
      legendTitle: "Status mix",
      legend: [
        { label: "Success", state: "success" },
        { label: "In progress", state: "running" },
        { label: "Waiting", state: "waiting" },
      ],
      tableTitle: "Recent runs",
      rows: [
        {
          automation: "Data backup",
          status: "Completed",
          lastRun: "2 min ago",
          state: "success",
        },
        {
          automation: "Email campaign",
          status: "Running",
          lastRun: "5 min ago",
          state: "running",
        },
        {
          automation: "API sync",
          status: "Completed",
          lastRun: "6 min ago",
          state: "success",
        },
        {
          automation: "Report generation",
          status: "Completed",
          lastRun: "7 min ago",
          state: "success",
        },
      ],
    },
  },
}

export type HeroV9Props = Partial<HeroV9Content> & {
  preview?: Partial<ProductPreviewConfig>
}

export function resolveHeroV9Content(overrides?: HeroV9Props): HeroV9Content {
  return {
    title: overrides?.title ?? heroV9Content.title,
    description: overrides?.description ?? heroV9Content.description,
    primaryCta: overrides?.primaryCta ?? heroV9Content.primaryCta,
    secondaryCta: overrides?.secondaryCta ?? heroV9Content.secondaryCta,
  }
}

export function resolveHeroV9Preview(
  overrides?: HeroV9Props["preview"]
): ProductPreviewConfig {
  if (!overrides) return heroV9Preview

  return {
    metrics: overrides.metrics ?? heroV9Preview.metrics,
    panels: {
      activity: {
        ...heroV9Preview.panels.activity,
        ...overrides.panels?.activity,
      },
      tasks: {
        ...heroV9Preview.panels.tasks,
        ...overrides.panels?.tasks,
      },
    },
  }
}
