import type { Brand } from "../lib/brands"

export default function BrandPill({ brand }: { brand: Brand }) {
  const Light = brand.light
  const Dark = brand.dark

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5">
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        {Dark ? (
          <>
            <Light
              className="size-4 dark:hidden"
              aria-hidden
            />
            <Dark
              className="hidden size-4 dark:block"
              aria-hidden
            />
          </>
        ) : (
          <Light className="size-4" aria-hidden />
        )}
      </span>
      <span className="text-xs font-medium whitespace-nowrap text-foreground">
        {brand.name}
      </span>
    </span>
  )
}
