"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import PricingCard from "./pricing-card"
import { pricingPlans, type BillingCycle } from "../lib/pricing-plans"

export default function PricingSectionV2() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")

  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-4xl font-medium tracking-tight text-balance md:text-5xl">
            Pricing
          </h2>
          <div className="mt-6 flex justify-center">
            <fieldset>
              <legend className="sr-only">Billing frequency</legend>
              <div className="relative inline-grid grid-cols-2 rounded-full bg-muted p-0.5">
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-0.5 bottom-0.5 rounded-full border border-border bg-background shadow-sm transition-transform duration-200 ease-out",
                    billingCycle === "yearly" && "translate-x-full"
                  )}
                  style={{ left: "2px", width: "calc(50% - 2px)" }}
                />
                <label className="relative z-10 cursor-pointer rounded-full px-5 py-1.5 text-center">
                  <input
                    checked={billingCycle === "monthly"}
                    className="sr-only"
                    name="billing"
                    type="radio"
                    value="monthly"
                    onChange={() => setBillingCycle("monthly")}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium leading-none transition-colors",
                      billingCycle === "monthly"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    Monthly
                  </span>
                </label>
                <label className="relative z-10 cursor-pointer rounded-full px-5 py-1.5 text-center">
                  <input
                    checked={billingCycle === "yearly"}
                    className="sr-only"
                    name="billing"
                    type="radio"
                    value="yearly"
                    onChange={() => setBillingCycle("yearly")}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium leading-none transition-colors",
                      billingCycle === "yearly"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    Yearly
                  </span>
                </label>
              </div>
            </fieldset>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              billingCycle={billingCycle}
              plan={plan}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
