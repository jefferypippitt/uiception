import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { BillingCycle, PricingPlan } from "../lib/pricing-plans"

type PricingCardProps = {
  plan: PricingPlan
  billingCycle: BillingCycle
}

export default function PricingCard({ plan, billingCycle }: PricingCardProps) {
  const pricing = billingCycle === "yearly" ? plan.yearly : plan.monthly

  return (
    <li className="min-w-0">
      <Card className="flex h-full flex-col justify-between rounded-sm border p-5 shadow-none gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{plan.name}</p>
          <p className="mt-2 text-2xl font-medium text-muted-foreground">
            {pricing.price}
          </p>
          <p className="mt-4 text-sm text-foreground">{plan.intro}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-xs leading-relaxed font-light text-foreground"
              >
                <CheckIcon
                  aria-hidden
                  className="mt-0.5 size-3.5 shrink-0 text-foreground"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Button
            size="lg"
            className="rounded-full"
            variant={plan.ctaVariant ?? "default"}
          >
            {plan.ctaLabel}
          </Button>
        </div>
      </Card>
    </li>
  )
}
