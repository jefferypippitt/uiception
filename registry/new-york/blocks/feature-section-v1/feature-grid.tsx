"use client"

import { featureSectionItems } from "./features"

import "./feature-grid.css"

export default function FeatureGrid() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {featureSectionItems.map(({ id, title, description, index, Icon }) => (
        <li key={id} className="flex min-w-0 flex-col">
          <div className="fsv1-card group relative min-h-46 flex-1 overflow-hidden rounded-none bg-background text-foreground ring-1 ring-border">
            <div className="fsv1-card-front absolute inset-0 flex flex-col items-start p-5 pr-5.4 pb-4.6">
              <Icon className="size-[1.65rem] shrink-0 opacity-90" aria-hidden />
              <p className="mt-auto m-0 font-mono text-2.75 leading-[1.35] font-medium tracking-[0.14em] text-foreground/90 uppercase">
                {title}
              </p>
            </div>
            <div className="fsv1-card-back absolute inset-0 flex flex-col justify-start p-5 pr-5.4 pb-4.6">
              <p className="m-0 text-3.25 leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          <footer className="pt-3">
            <p className="m-0 font-mono text-xs leading-none font-medium tabular-nums tracking-[0.14em] text-muted-foreground/90 uppercase">
              [{index.toString().padStart(2, "0")}]
            </p>
          </footer>
        </li>
      ))}
    </ul>
  )
}
