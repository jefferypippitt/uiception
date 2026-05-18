"use client"

import {
  ArrowsLeftRight,
  Circle,
  Database,
  PlugsConnected,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Salesforce } from "@/components/ui/svgs/salesforce"
import { Slack } from "@/components/ui/svgs/slack"
import { Stripe } from "@/components/ui/svgs/stripe"

import { usePipelineDemoAnimation } from "../hooks/use-pipeline-demo-animation"
import {
  DESTINATION_CHIPS,
  PIPELINE_STAGES,
} from "../lib/pipeline-config"

import "../styles/hero-section-v7.css"

const DESTINATION_LOGOS = {
  slack: Slack,
  salesforce: Salesforce,
  stripe: Stripe,
} as const

const STAGE_ICONS = {
  ingest: PlugsConnected,
  transform: ArrowsLeftRight,
  deliver: Database,
} as const

type StageId = keyof typeof STAGE_ICONS

function StageNode({
  stageId,
  label,
  detail,
  active,
}: {
  stageId: StageId
  label: string
  detail: string
  active: boolean
}) {
  const Icon = STAGE_ICONS[stageId]

  return (
    <div
      className={cn(
        "hero-v7-pipeline__node",
        `hero-v7-pipeline__node--${stageId}`,
        active && "hero-v7-pipeline__node--active",
      )}
    >
      <span className="hero-v7-pipeline__node-icon" aria-hidden>
        <Icon size={18} weight="duotone" />
      </span>
      <span className="hero-v7-pipeline__node-label">{label}</span>
      <span className="hero-v7-pipeline__node-detail">{detail}</span>
    </div>
  )
}

export default function PipelineDemo() {
  const { run, stage, activeDestinations, lineARef, lineBRef } =
    usePipelineDemoAnimation()

  const isStageActive = (id: StageId) => stage === id

  return (
    <div
      className="hero-v7-pipeline mx-auto w-full max-w-3xl text-left"
      aria-label="Live integration pipeline demo"
    >
      <div className="hero-v7-pipeline__shell">
        <header className="hero-v7-pipeline__header">
          <div className="hero-v7-pipeline__header-main">
            <span className="hero-v7-pipeline__run-id font-mono">{run.id}</span>
            <span className="hero-v7-pipeline__status">
              <Circle
                className={cn(
                  "hero-v7-pipeline__status-dot",
                  stage !== "idle" && "hero-v7-pipeline__status-dot--live",
                )}
                size={8}
                weight="fill"
                aria-hidden
              />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {stage === "idle" ? "Routed" : "Live"}
              </span>
            </span>
          </div>
          <span className="hero-v7-pipeline__latency font-mono tabular-nums">
            {run.latencyMs}
            <span className="text-muted-foreground">ms</span>
          </span>
        </header>

        <div className="hero-v7-pipeline__track">
          <div className="hero-v7-pipeline__nodes">
            <StageNode
              stageId="ingest"
              label={PIPELINE_STAGES[0].label}
              detail={PIPELINE_STAGES[0].detail}
              active={isStageActive("ingest")}
            />

            <div
              ref={lineARef}
              className="hero-v7-pipeline__line hero-v7-pipeline__line--a"
              aria-hidden
            />

            <StageNode
              stageId="transform"
              label={PIPELINE_STAGES[1].label}
              detail={PIPELINE_STAGES[1].detail}
              active={isStageActive("transform")}
            />

            <div
              ref={lineBRef}
              className="hero-v7-pipeline__line hero-v7-pipeline__line--b"
              aria-hidden
            />

            <StageNode
              stageId="deliver"
              label={PIPELINE_STAGES[2].label}
              detail={PIPELINE_STAGES[2].detail}
              active={isStageActive("deliver")}
            />
          </div>

          <div
            className="hero-v7-pipeline__badges"
            aria-label="Delivery destinations"
          >
            {DESTINATION_CHIPS.map((chip) => {
              const lit =
                activeDestinations.includes(chip.label) ||
                (stage === "idle" && run.destinations.includes(chip.label))
              const Logo = DESTINATION_LOGOS[chip.id]
              return (
                <span
                  key={chip.id}
                  className={cn(
                    "hero-v7-pipeline__chip",
                    `hero-v7-pipeline__chip--${chip.id}`,
                    lit && "hero-v7-pipeline__chip--lit",
                  )}
                >
                  <Logo className="hero-v7-pipeline__chip-logo" />
                  <span className="sr-only">{chip.label}</span>
                </span>
              )
            })}
          </div>
        </div>

        <footer className="hero-v7-pipeline__log font-mono">
          <span className="hero-v7-pipeline__log-step hero-v7-pipeline__log-step--source">
            {run.source}
          </span>
          <span className="hero-v7-pipeline__log-arrow" aria-hidden>
            →
          </span>
          <span className="hero-v7-pipeline__log-step hero-v7-pipeline__log-step--transform">
            {run.transform}
          </span>
          <span className="hero-v7-pipeline__log-arrow" aria-hidden>
            →
          </span>
          <span className="hero-v7-pipeline__log-step hero-v7-pipeline__log-step--dest">
            {run.destinations.join(" + ")}
          </span>
        </footer>
      </div>
    </div>
  )
}
