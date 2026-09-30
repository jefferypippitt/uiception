import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PricingPlan } from "../lib/pricing-plans"

type PricingCardProps = {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  const inverted = plan.highlighted ?? false

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center rounded-2xl px-6 pt-8 pb-6 text-center",
        inverted ? "bg-foreground" : "bg-muted"
      )}
    >
      <h3
        className={cn(
          "text-lg font-medium tracking-tight",
          inverted ? "text-background" : "text-foreground"
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "mt-4 text-4xl font-semibold tracking-tight md:text-5xl",
          inverted ? "text-background" : "text-foreground"
        )}
      >
        {plan.price}
      </p>
      <p
        className={cn(
          "mt-2 text-sm",
          inverted ? "text-background/65" : "text-muted-foreground"
        )}
      >
        {plan.priceSuffix}
      </p>
      <Button
        size="lg"
        className={cn(
          "mt-6 w-full max-w-48 rounded-full",
          inverted && "bg-background text-foreground hover:bg-background/90"
        )}
      >
        {plan.ctaLabel}
      </Button>
    </div>
  )
}
