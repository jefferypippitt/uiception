function Spacer({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const heights = { sm: "h-4", md: "h-8", lg: "h-16", xl: "h-28" }
  return <div className={heights[size]} />
}

function Block({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-3" />
      ))}
    </div>
  )
}

export default function NavbarLoremDemo() {
  return (
    <main className="px-4 py-4 md:py-6 lg:py-8">
      <article
        aria-label="Sample document preview"
        className="mx-auto w-full max-w-2xl rounded-none border border-border bg-card text-card-foreground shadow-sm"
      >
        <header className="px-8 py-8 pt-10 sm:px-10">
          <span className="font-serif text-2xl text-foreground">
            uiception.com
          </span>
        </header>

        <div className="px-8 py-12 sm:px-10">
          <Spacer size="xl" />
          <Block rows={3} />
          <Spacer size="xl" />
          <Block rows={3} />
          <Spacer size="xl" />
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <Block key={i} rows={3} />
            ))}
          </div>
          <Spacer size="xl" />
          <Block rows={3} />
          <Spacer size="xl" />
          <Block rows={3} />
          <Spacer size="xl" />
        </div>
      </article>
    </main>
  )
}
