import { featureSectionItems } from "../lib/features"
import { FeatureIcon } from "./feature-icons"

function renderDescription(description: string, emphasis: string) {
  const index = description.indexOf(emphasis)
  if (index === -1) return description

  return (
    <>
      {description.slice(0, index)}
      <strong className="font-semibold text-foreground">{emphasis}</strong>
      {description.slice(index + emphasis.length)}
    </>
  )
}

export default function FeatureGrid() {
  return (
    <ul className="mt-8 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:mt-10 lg:gap-x-10 lg:gap-y-12">
      {featureSectionItems.map(({ id, title, description, emphasis, icon }) => (
        <li key={id} className="min-w-0">
          <div className="flex items-center gap-2.5">
            <FeatureIcon
              icon={icon}
              className="size-5 shrink-0 text-foreground"
            />
            <h3 className="text-sm font-medium tracking-[0.08em] text-foreground uppercase">
              {title}
            </h3>
          </div>
          <p className="mt-2.5 max-w-[36ch] text-base leading-relaxed text-muted-foreground">
            {renderDescription(description, emphasis)}
          </p>
        </li>
      ))}
    </ul>
  )
}
