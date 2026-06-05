import { Star } from "lucide-react"

export function StatsSectionV1Content() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-row gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-sm font-medium tracking-tighter">
        Trusted by 100+ growing businesses
      </p>
    </div>
  )
}

export default function StatsSectionV1() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <StatsSectionV1Content />
      </div>
    </section>
  )
}
