import PricingCard from "./pricing-card"
import PricingTable from "./pricing-table"
import { pricingPlans } from "../lib/pricing-plans"

export default function PricingSectionV6() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-4xl font-medium tracking-tight text-balance text-foreground md:text-5xl">
            Our plans scale with{" "}
            <span className="text-muted-foreground">your business</span>
          </h2>
        </div>
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-3 sm:p-4 md:gap-8 md:p-5">
          {/* Stacks on mobile; from md it matches `planGridClassName` so cards sit over their table values. */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-x-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <PricingTable />
        </div>
      </div>
    </section>
  )
}
