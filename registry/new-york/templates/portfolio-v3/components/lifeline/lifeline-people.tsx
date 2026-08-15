import { CompanyIcon } from "./company-icon"
import type { LifelineMarker, LifelineMetPerson } from "./types"

export function aggregateLifelinePeople(
  marker: LifelineMarker,
): LifelineMetPerson[] {
  const map = new Map<string, LifelineMetPerson>()

  marker.met?.forEach((person) => {
    if (!map.has(person.name)) map.set(person.name, person)
  })

  return [...map.values()]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

interface LifelinePeopleProps {
  people: LifelineMetPerson[]
  allowWrap?: boolean
}

export function LifelinePeople({
  people,
  allowWrap = false,
}: LifelinePeopleProps) {
  if (people.length === 0) return null

  return (
    <div className="flex w-full flex-col gap-3">
      {people.map((person) => (
        <div key={person.name} className="flex w-full items-center gap-2.5">
          <div className="flex w-3 shrink-0 items-center justify-center">
            <span
              className="size-1.5 rounded-full bg-pink-500"
              aria-hidden="true"
            />
          </div>
          {person.icon ? (
            <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-foreground">
              <CompanyIcon
                id={person.icon}
                label={person.name}
                className="h-4 w-5"
              />
            </span>
          ) : (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background transition-colors duration-300">
              {getInitials(person.name)}
            </span>
          )}
          <div
            className={
              allowWrap
                ? "min-w-0 text-left leading-snug"
                : "min-w-0 whitespace-nowrap text-left"
            }
          >
            <p className="text-[13px] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              {person.name}
            </p>
            {person.role ? (
              <p className="text-[11px] text-muted-foreground/80">
                {person.role}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
