import PricingCard from "./pricing-card"
import { pricingPlans } from "../lib/pricing-plans"

export default function PricingSectionV4() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-4xl font-medium tracking-tight text-balance text-foreground md:text-5xl">
            Simple Plans.
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Plans for individual and growing teams.
          </p>
        </div>
        <ul className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 md:gap-5">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </ul>
      </div>
    </section>
  )
}
