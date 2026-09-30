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
import type { PricingPlan } from "../lib/pricing-plans"

type PricingCardProps = {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground uppercase">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {plan.subtitle}
          </CardDescription>
          <div className="flex items-end gap-2">
            <p className="text-4xl leading-none font-semibold tracking-tight">
              {plan.priceLabel}
            </p>
            {plan.priceSuffix ? (
              <p className="pb-2 text-muted-foreground">
                {plan.priceSuffix}
              </p>
            ) : null}
          </div>
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
  )
}
