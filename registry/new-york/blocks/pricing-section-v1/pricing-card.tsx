import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PricingPlan } from "./pricing-plans"

type PricingCardProps = {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <li className="min-w-0">
      <Card
        className={cn(
          "relative h-full gap-0 border border-border/80 py-0 shadow-none",
          plan.popular && "ring-1 ring-primary/30"
        )}
      >
        <CardHeader className="gap-3 border-b px-5 pt-5 pb-4">
          {plan.popular ? (
            <span className="absolute top-4 right-4 rounded-full border border-border bg-muted px-2.5 py-0.5 text-2.75 font-medium tracking-[0.06em] text-muted-foreground uppercase">
              Most popular
            </span>
          ) : null}
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {plan.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              {plan.subtitle}
            </CardDescription>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-4xl leading-none font-semibold tracking-tight">
              {plan.priceLabel}
            </p>
            {plan.priceSuffix ? (
              <p className="pb-1 text-sm text-muted-foreground">
                {plan.priceSuffix}
              </p>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{plan.monthlyLabel}</p>
        </CardHeader>
        <CardContent className="flex-1 px-5 pt-4 pb-5">
          <p className="mb-3 text-sm font-medium text-foreground">
            {plan.intro}
          </p>
          <ul className="flex flex-col gap-2">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm leading-relaxed font-light text-muted-foreground"
              >
                <CheckIcon
                  aria-hidden={true}
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent p-4">
          <Button
            className="w-full rounded-full"
            variant={plan.ctaVariant ?? "default"}
          >
            {plan.ctaLabel}
          </Button>
        </CardFooter>
      </Card>
    </li>
  )
}
