import type { Icon } from "@tabler/icons-react"
import {
  IconChartLine,
  IconClock,
  IconCoins,
  IconCpu,
  IconFolders,
  IconGauge,
  IconGitBranch,
  IconGlobe,
  IconHeadset,
  IconKey,
  IconLink,
  IconServer,
  IconShield,
  IconShieldCheck,
  IconShieldOff,
  IconSnowflake,
  IconStopwatch,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FeatureIcon, PricingPlan } from "../lib/pricing-plans"

const featureIcons: Record<FeatureIcon, Icon> = {
  timer: IconStopwatch,
  "git-branch": IconGitBranch,
  shield: IconShield,
  globe: IconGlobe,
  cpu: IconCpu,
  "shield-ban": IconShieldOff,
  activity: IconChartLine,
  "circle-dollar-sign": IconCoins,
  gauge: IconGauge,
  wallet: IconWallet,
  users: IconUsers,
  snowflake: IconSnowflake,
  link: IconLink,
  "key-round": IconKey,
  "folder-sync": IconFolders,
  "shield-plus": IconShieldCheck,
  server: IconServer,
  clock: IconClock,
  headset: IconHeadset,
}

type PricingCardProps = {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <li
      className={cn(
        "flex min-w-0 flex-col border-border p-6",
        "border-b last:border-b-0 lg:row-span-7 lg:grid lg:grid-rows-subgrid lg:border-b-0 lg:border-r lg:last:border-r-0",
        plan.popular && "bg-muted/40"
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-foreground">{plan.name}</h3>
        {plan.popular ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            Popular
          </span>
        ) : null}
      </div>

      <p className="mt-4 flex items-baseline gap-1 lg:mt-0 lg:pt-4">
        <span className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {plan.price}
        </span>
        {plan.priceSuffix ? (
          <span className="text-sm text-muted-foreground">
            {plan.priceSuffix}
          </span>
        ) : null}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:mt-0 lg:pt-3">
        {plan.description}
      </p>

      <div className="py-5" aria-hidden>
        <div className="h-px w-full bg-border" />
      </div>

      <p
        className={cn(
          "pb-4 text-sm text-muted-foreground",
          !plan.featuresIntro && "invisible"
        )}
      >
        {plan.featuresIntro ?? "Everything included:"}
      </p>

      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => {
          const Icon = featureIcons[feature.icon]
          return (
            <li
              key={feature.label}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
            >
              <Icon
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-foreground"
                stroke={1.5}
              />
              <span>{feature.label}</span>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto pt-8">
        <Button
          size="lg"
          className="rounded-full px-5"
          variant={plan.ctaVariant}
        >
          {plan.ctaLabel}
        </Button>
      </div>
    </li>
  )
}
