import { cn } from "@/lib/utils"
import { featureLabelClassName, planGridClassName } from "../lib/layout"
import { pricingFeatures, pricingPlans } from "../lib/pricing-plans"
import FeatureValue from "./feature-value"

export default function PricingTable() {
  return (
    <div role="table" aria-label="Plan comparison" className="flex flex-col">
      <div role="rowgroup">
        {/* Plan names: visible when cards stack on mobile, screen-reader only once they sit above their columns. */}
        <div role="row" className={cn(planGridClassName, "pb-3 md:sr-only")}>
          <span role="columnheader" className="sr-only">
            Feature
          </span>
          {pricingPlans.map((plan) => (
            <span
              key={plan.id}
              role="columnheader"
              className="text-center text-sm font-medium text-foreground"
            >
              {plan.name}
            </span>
          ))}
        </div>
      </div>
      <div role="rowgroup" className="flex flex-col">
        {pricingFeatures.map((feature, index) => (
          <div
            key={feature.label}
            role="row"
            className={cn(
              planGridClassName,
              "relative min-h-10 items-center gap-y-1.5 rounded-lg py-2",
              index % 2 === 0 && "bg-muted"
            )}
          >
            <span
              role="rowheader"
              className={cn(
                "col-span-3 pl-3 text-xs text-foreground sm:pl-5 sm:text-sm",
                featureLabelClassName
              )}
            >
              {feature.label}
            </span>
            {pricingPlans.map((plan) => (
              <span
                key={plan.id}
                role="cell"
                className="flex items-center justify-center"
              >
                <FeatureValue value={feature.values[plan.id]} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
