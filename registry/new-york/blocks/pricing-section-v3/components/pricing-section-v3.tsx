"use client"

import { useId, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import PricingCard from "./pricing-card"
import { pricingPlans, type BillingCycle } from "../lib/pricing-plans"

export default function PricingSectionV3() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const switchId = useId()
  const groupId = useId()

  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-serif text-4xl leading-[1.15] tracking-tight text-balance md:text-5xl">
            <span className="block text-foreground">Simple pricing</span>
            <span className="mt-1 block text-muted-foreground">
              Plans that grow with you
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Pick a plan that matches your team size. Every tier includes core
            product access, with higher plans unlocking automation, security,
            and hands-on support.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            role="group"
            aria-labelledby={groupId}
          >
            <span id={groupId} className="sr-only">
              Billing frequency
            </span>
            <Label
              className="cursor-pointer text-sm font-medium text-foreground"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Label>
            <Switch
              id={switchId}
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) =>
                setBillingCycle(checked ? "yearly" : "monthly")
              }
              aria-label="Bill yearly"
            />
            <Label
              className="cursor-pointer text-sm font-medium text-foreground"
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </Label>
            <Badge variant="outline">Save 20%</Badge>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
