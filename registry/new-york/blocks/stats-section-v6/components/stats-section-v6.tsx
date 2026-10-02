import { groups, sectionHeader } from "../lib/config"
import { type TileSize, TierTile } from "./tier-tile"
import "../styles/stats-section-v6.css"

/** Bento placement by rank: the biggest group gets the big tile. */
const tiles: { size: TileSize; className: string }[] = [
  { size: "feature", className: "col-span-2 md:row-span-2" },
  { size: "wide", className: "col-span-2" },
  { size: "compact", className: "col-span-1" },
  { size: "compact", className: "col-span-1" },
]

export default function StatsSectionV6() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-4">
          <h2 className="text-3xl leading-[1.15] font-medium tracking-tight text-foreground md:text-4xl">
            {sectionHeader.title}
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {sectionHeader.description}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4 md:grid-rows-[repeat(2,16rem)] lg:col-span-8">
          {groups.map((group, index) => (
            <TierTile
              key={group.id}
              group={group}
              groupIndex={index}
              size={tiles[index].size}
              className={tiles[index].className}
            />
          ))}
        </dl>
      </div>
    </section>
  )
}
