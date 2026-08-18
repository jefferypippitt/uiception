"use client"

import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "./ui/button"

export function BackLink({ className }: { className?: string }) {
  return (
    <Button size="sm" asChild className={className}>
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        data-transition-types="nav-back"
      >
        <ChevronLeftIcon data-icon="inline-start" />
        Back
      </Link>
    </Button>
  )
}
