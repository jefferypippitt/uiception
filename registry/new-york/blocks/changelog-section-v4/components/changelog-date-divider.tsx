import { GeistMono } from "geist/font/mono"

/**
 * Section break between date groups: a small uppercase date tag followed by a
 * rule that runs the rest of the row. Stands in for v3's vertical timeline
 * rail without drawing one — each group just opens with its own horizontal
 * line instead of hanging off a continuous spine.
 */
export default function ChangelogDateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 pt-14 pb-6 first:pt-0">
      <span
        className={`${GeistMono.className} shrink-0 text-xs font-medium tracking-widest text-muted-foreground uppercase`}
      >
        {label}
      </span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  )
}
