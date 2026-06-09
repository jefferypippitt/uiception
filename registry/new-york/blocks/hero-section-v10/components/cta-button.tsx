import Link from "next/link"

import { Button } from "@/components/ui/button"

const HREF = "#"

export default function CtaButton() {
  return (
    <Button size="lg" className="w-full text-[16px] sm:w-auto" asChild>
      <Link href={HREF}>Get Started Free</Link>
    </Button>
  )
}
