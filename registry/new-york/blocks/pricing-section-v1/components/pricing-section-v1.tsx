import PricingCard from "./pricing-card"
import { pricingPlans } from "../lib/pricing-plans"

export default function PricingSectionV1() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-4xl font-medium tracking-tight text-balance md:text-5xl">
            Pricing built for teams that execute.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Rolling access - Limited spots.
          </p>
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
