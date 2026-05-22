import { cn } from "@/lib/utils"

import { featureSectionItems } from "./features"

import "./feature-grid.css"

const cellClassNames = [
  "sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:col-start-1 lg:row-start-1",
  "lg:col-span-2 lg:col-start-2 lg:row-start-1",
  "sm:max-lg:col-span-1 lg:col-start-2 lg:row-start-2",
  "sm:max-lg:col-span-1 lg:col-start-3 lg:row-start-2",
] as const

export default function FeatureGrid() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:grid-rows-[minmax(11.25rem,auto)_minmax(11.25rem,auto)] lg:items-stretch">
      {featureSectionItems.map(({ id, title, description }, index) => (
        <li key={id} className={cn("flex min-w-0", cellClassNames[index])}>
          <div
            className={cn(
              "fsv5-card group relative flex min-h-0 w-full flex-1 flex-col items-start gap-2.5 overflow-hidden rounded-none bg-[color-mix(in_oklab,var(--muted)_82%,var(--background)_18%)] p-5 pr-5.4 pb-5.4 text-foreground",
              index === 1 &&
                "grid grid-cols-[minmax(0,min(38ch,100%))] content-center justify-center justify-items-stretch gap-2.5 text-left lg:grid-cols-[minmax(0,min(54ch,94%))] lg:px-[clamp(1.25rem,2.5vw,1.85rem)] lg:py-5.4",
              index === 0 &&
                "lg:justify-center lg:gap-3.5 lg:px-6.4 lg:pt-6 lg:pb-6.6",
              (index === 2 || index === 3) &&
                "sm:max-lg:justify-start lg:justify-start lg:gap-2.5 lg:px-5 lg:pt-5 lg:pb-5.4"
            )}
          >
            <p
              className={cn(
                "fsv5-card-title m-0 w-full min-w-0 font-sans font-medium text-foreground",
                index === 0 &&
                  "text-xl leading-[1.15] tracking-[-0.015em] sm:text-5.5 lg:max-w-[14em] lg:text-6.5 lg:tracking-[-0.02em]",
                index === 1 &&
                  "text-lg leading-tight tracking-[-0.01em] lg:text-xl lg:leading-[1.2] lg:tracking-[-0.015em]",
                (index === 2 || index === 3) &&
                  "text-base leading-snug tracking-[-0.01em] text-pretty"
              )}
            >
              <span className="fsv5-card-title__ghost" aria-hidden="true">
                {title}
              </span>
              <span className="fsv5-card-title__label">{title}</span>
            </p>
            <p
              className={cn(
                "m-0 w-full min-w-0 font-sans text-sm leading-[1.55] text-muted-foreground max-sm:mt-0",
                index === 0 &&
                  "max-w-[min(38ch,100%)] text-3.75 leading-relaxed lg:mt-0 lg:max-w-[min(40ch,100%)] lg:text-base lg:leading-[1.65]",
                index === 1 &&
                  "mt-0 text-3.75 leading-relaxed lg:leading-[1.6]",
                (index === 2 || index === 3) && "mt-auto sm:max-lg:mt-0 lg:mt-0"
              )}
            >
              {description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
