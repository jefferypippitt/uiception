"use client"

import {
  Bicycle,
  Circle,
  CookingPot,
  Receipt,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Doordash } from "@/components/ui/svgs/doordash"
import { UberEats } from "@/components/ui/svgs/ubereats"

import { usePipelineDemoAnimation } from "../hooks/use-pipeline-demo-animation"
import {
  DELIVERY_PLATFORMS,
  DELIVERY_STAGES,
  getDeliveryPlatformState,
  getFooterPlatforms,
  getFooterStepActive,
  type DeliveryPlatformState,
  type PipelineStage,
} from "../lib/pipeline-config"

const PLATFORM_LOGOS = {
  ubereats: UberEats,
  doordash: Doordash,
} as const

const STAGE_ICONS = {
  ingest: Receipt,
  transform: CookingPot,
  deliver: Bicycle,
} as const

type StageId = keyof typeof STAGE_ICONS

const PLATFORM_CHIP_STYLES: Record<DeliveryPlatformState, string> = {
  inactive: "[&_svg]:opacity-25",
  pending: "[&_svg]:opacity-40",
  queued:
    "border-blue-500/35 bg-blue-500/5 ring-2 ring-blue-500/15 [&_svg]:opacity-70",
  delivering:
    "border-orange-500/25 bg-orange-500/4 [&_svg]:opacity-50",
  delivered:
    "border-orange-500 bg-orange-500/8 ring-2 ring-orange-500/25 [&_svg]:opacity-100",
  complete:
    "border-orange-500/45 bg-orange-500/6 [&_svg]:opacity-100",
}

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
        "flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl border border-zinc-900/12 px-3 py-3 text-center transition-[border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/12",
        stageId === "ingest" &&
          active &&
          "border-zinc-900/28 dark:border-white/28 [&_.hero-v7-pipeline__node-icon]:text-zinc-600 dark:[&_.hero-v7-pipeline__node-icon]:text-zinc-300",
        stageId === "transform" &&
          active &&
          "border-blue-500 ring-2 ring-blue-500/25 [&_.hero-v7-pipeline__node-icon]:text-blue-500",
        stageId === "deliver" &&
          active &&
          "border-orange-500 ring-2 ring-orange-500/25 [&_.hero-v7-pipeline__node-icon]:text-orange-500"
      )}
    >
      <span
        className="hero-v7-pipeline__node-icon inline-flex text-zinc-400 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        aria-hidden
      >
        <Icon size={20} weight="duotone" />
      </span>
      <span
        className={cn(
          "text-sm font-medium tracking-tight text-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active && stageId === "ingest" && "font-semibold",
          active &&
            stageId === "transform" &&
            "font-semibold text-blue-600 dark:text-blue-400",
          active &&
            stageId === "deliver" &&
            "font-semibold text-orange-600 dark:text-orange-400"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "max-w-39 text-pretty font-mono text-xs leading-relaxed tracking-tight text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active && "text-foreground/75"
        )}
      >
        {detail}
      </span>
    </div>
  )
}

function PlatformChip({
  chipId,
  label,
  state,
}: {
  chipId: keyof typeof PLATFORM_LOGOS
  label: string
  state: DeliveryPlatformState
}) {
  const Logo = PLATFORM_LOGOS[chipId]

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-zinc-900/10 px-2.5 py-1.5 transition-[border-color,background-color,opacity,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10",
        PLATFORM_CHIP_STYLES[state]
      )}
    >
      <Logo className="block size-5.5 w-auto transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

function isStageActive(stage: PipelineStage, id: StageId) {
  return stage === id
}

export default function PipelineDemo() {
  const { run, stage, activePlatforms, lineARef, lineBRef } =
    usePipelineDemoAnimation()

  const footerPlatforms = getFooterPlatforms(stage, run.platforms)
  const footerActive = getFooterStepActive(stage, run.platforms)

  return (
    <div
      className="mx-auto mt-2 w-full max-w-3xl text-left"
      aria-label="Live food delivery demo"
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-900/10 bg-zinc-50 shadow-[0_24px_48px_-28px_rgba(24,24,27,0.18)] dark:border-white/10 dark:bg-[#141414] dark:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.45)]">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-900/8 px-4 py-3 text-xs dark:border-white/8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-2.75 tracking-wider text-muted-foreground">
              {run.id}
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              <Circle
                className={cn(
                  "text-zinc-400 transition-colors duration-250 ease-out",
                  stage !== "idle" && "text-green-500"
                )}
                size={8}
                weight="fill"
                aria-hidden
              />
              <span className="font-mono text-2.75 tracking-wider uppercase">
                {stage === "idle" ? "Delivered" : "In progress"}
              </span>
            </span>
          </div>
          <span className="font-mono text-3.25 text-foreground tabular-nums">
            {run.etaMin}
            <span className="text-muted-foreground"> min</span>
          </span>
        </header>

        <div className="flex flex-col gap-3 px-4 pt-5 pb-4">
          <div className="relative z-1 grid grid-cols-1 items-start gap-3 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)] sm:items-stretch sm:gap-0">
            <StageNode
              stageId="ingest"
              label={DELIVERY_STAGES[0].label}
              detail={DELIVERY_STAGES[0].detail}
              active={isStageActive(stage, "ingest")}
            />

            <div
              ref={lineARef}
              className="hero-v7-pipeline__line hero-v7-pipeline__line--transform relative hidden h-0.5 self-center overflow-hidden rounded-full bg-zinc-900/8 sm:block dark:bg-white/8"
              aria-hidden
            />

            <StageNode
              stageId="transform"
              label={DELIVERY_STAGES[1].label}
              detail={DELIVERY_STAGES[1].detail}
              active={isStageActive(stage, "transform")}
            />

            <div
              ref={lineBRef}
              className="hero-v7-pipeline__line hero-v7-pipeline__line--deliver relative hidden h-0.5 self-center overflow-hidden rounded-full bg-zinc-900/8 sm:block dark:bg-white/8"
              aria-hidden
            />

            <StageNode
              stageId="deliver"
              label={DELIVERY_STAGES[2].label}
              detail={DELIVERY_STAGES[2].detail}
              active={isStageActive(stage, "deliver")}
            />
          </div>

          <div
            className="flex flex-wrap justify-center gap-2 pt-1"
            aria-label="Delivery apps"
          >
            {DELIVERY_PLATFORMS.map((chip) => (
              <PlatformChip
                key={chip.id}
                chipId={chip.id}
                label={chip.label}
                state={getDeliveryPlatformState(
                  chip.label,
                  run.platforms,
                  stage,
                  activePlatforms
                )}
              />
            ))}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-t border-zinc-900/8 px-4 py-3 font-mono text-sm leading-snug dark:border-white/8">
          <span
            className={cn(
              "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              footerActive.order
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {run.order}
          </span>
          <span className="text-zinc-400" aria-hidden>
            →
          </span>
          <span
            className={cn(
              "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              footerActive.prep
                ? "font-medium text-blue-600 dark:text-blue-400"
                : "text-muted-foreground"
            )}
          >
            {run.prep}
          </span>
          <span className="text-zinc-400" aria-hidden>
            →
          </span>
          <span
            className={cn(
              "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              footerActive.platforms
                ? "font-medium text-orange-600 dark:text-orange-400"
                : "text-muted-foreground"
            )}
          >
            {footerPlatforms.text}
          </span>
        </footer>
      </div>
    </div>
  )
}
