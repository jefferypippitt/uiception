import Link from "next/link"

import { Button } from "@/components/ui/button"

const PRIMARY_HREF = "#"
const SECONDARY_HREF = "#"

export default function CtaButtons() {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">
      <Button size="lg" className="w-full sm:w-auto" asChild>
        <Link href={PRIMARY_HREF} className="text-center font-mono uppercase">
          Start payroll audit
        </Link>
      </Button>
      <Button variant="secondary" size="lg" className="w-full sm:w-auto" asChild>
        <Link href={SECONDARY_HREF} className="text-center font-mono uppercase">
          View platform tour
        </Link>
      </Button>
    </div>
  )
}
