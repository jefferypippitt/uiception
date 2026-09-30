import PricingCard from "./pricing-card"
import { pricingPlans } from "../lib/pricing-plans"
import { Badge } from "@/components/ui/badge"

export default function PricingSectionV1() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-2 text-4xl font-medium tracking-tight text-balance md:text-5xl">
            Priced To Scale.
          </h2>
          <Badge
            variant="secondary"
          >
           Limited Spots Available.
          </Badge>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </ul>
      </div>
    </section>
  )
}
