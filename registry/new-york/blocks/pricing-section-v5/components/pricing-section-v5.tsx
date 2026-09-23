import PricingCard from "./pricing-card"
import { pricingPlans } from "../lib/pricing-plans"

export default function PricingSectionV5() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-3xl font-medium tracking-tight text-balance text-foreground md:text-4xl lg:text-5xl lg:leading-[1.1]">
          Straightforward plans for every stage
        </h2>
        <ul className="mt-10 grid grid-cols-1 rounded-none border border-border bg-background lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto_auto_1fr_auto]">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </ul>
      </div>
    </section>
  )
}
