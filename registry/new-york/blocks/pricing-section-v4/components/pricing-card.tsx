"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { PricingPlan } from "../lib/pricing-plans"
import ProFluidShell from "./pro-fluid-shell"

type PricingCardProps = {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  const defaultCreditId = plan.creditOptions?.[0]?.id
  const [creditId, setCreditId] = useState(defaultCreditId ?? "")

  const selectedOption = plan.creditOptions?.find(
    (option) => option.id === creditId
  )
  const price = selectedOption?.price ?? plan.price ?? ""
  const isPro = plan.id === "pro"

  return (
    <li className="flex min-w-0 flex-col">
      {isPro ? (
        <ProFluidShell>
          {(fluidActive) => (
            <PlanCard
              plan={plan}
              price={price}
              creditId={creditId}
              onCreditChange={setCreditId}
              transparent
              onFluid={fluidActive}
            />
          )}
        </ProFluidShell>
      ) : (
        <PlanCard
          plan={plan}
          price={price}
          creditId={creditId}
          onCreditChange={setCreditId}
        />
      )}

      <div className="flex flex-col gap-3 px-1 pt-6">
        <p className="min-h-5 text-sm leading-5 text-muted-foreground">
          {plan.featuresIntro}
        </p>
        <ul className="flex flex-col">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex min-h-11 items-start gap-2.5 border-b border-dashed border-border py-3 text-sm leading-relaxed text-foreground last:border-b-0"
            >
              <CheckIcon
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

type PlanCardProps = {
  plan: PricingPlan
  price: string
  creditId: string
  onCreditChange: (value: string) => void
  transparent?: boolean
  /** Fluid is painting — use light-on-dark copy over the dark solver. */
  onFluid?: boolean
}

function PlanCard({
  plan,
  price,
  creditId,
  onCreditChange,
  transparent = false,
  onFluid = false,
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        "flex min-h-72 flex-1 flex-col gap-0 rounded-2xl py-0 shadow-none ring-0",
        transparent ? "bg-transparent" : "bg-muted"
      )}
    >
      <CardHeader className="gap-1 px-6 pt-6 pb-0">
        <CardTitle
          className={cn(
            "text-2xl font-semibold tracking-tight",
            onFluid ? "text-white" : "text-foreground"
          )}
        >
          {plan.name}
        </CardTitle>
        <CardDescription
          className={cn(
            "text-sm",
            onFluid ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-4 px-6 pt-10 pb-0">
        <p className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-4xl font-semibold tracking-tight",
              onFluid ? "text-white" : "text-foreground"
            )}
          >
            {price}
          </span>
          <span
            className={cn(
              "text-sm",
              onFluid ? "text-white/65" : "text-muted-foreground"
            )}
          >
            {plan.priceSuffix}
          </span>
        </p>

        <CreditControl
          label={plan.creditLabel}
          options={plan.creditOptions}
          creditId={creditId}
          onCreditChange={onCreditChange}
          onFluid={onFluid}
        />
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent p-6 pt-4">
        <Button
          className={cn(
            "w-full rounded-full",
            onFluid && "bg-white text-black hover:bg-white/90"
          )}
          size="lg"
        >
          {plan.ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

/** Shared chrome for static credit pills and the Pro Select — matches Button lg. */
const creditControlClassName = (onFluid: boolean) =>
  cn(
    "flex !h-9 w-full shrink-0 items-center rounded-full border-0 px-4 text-sm shadow-none",
    onFluid
      ? "!bg-white/15 text-white hover:!bg-white/20"
      : "!bg-background text-foreground hover:!bg-background"
  )

type CreditControlProps = {
  label?: string
  options?: PricingPlan["creditOptions"]
  creditId: string
  onCreditChange: (value: string) => void
  onFluid: boolean
}

function CreditControl({
  label,
  options,
  creditId,
  onCreditChange,
  onFluid,
}: CreditControlProps) {
  if (options) {
    return (
      <Select value={creditId} onValueChange={onCreditChange}>
        <SelectTrigger
          aria-label="Pro credit amount"
          className={cn(
            creditControlClassName(onFluid),
            "justify-between",
            onFluid && "[&_svg]:text-white/70"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className={cn(creditControlClassName(onFluid), "justify-center")}>
      {label}
    </div>
  )
}
