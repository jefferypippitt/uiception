import { HexFloat } from "../components/hex-float"
import { TextureTitle } from "../components/texture-title"
import { WaitlistPanel } from "../components/waitlist-panel"
import { site } from "../lib/site"

/** Black grain on paper — xerox wash over the page. */
const GRAIN_LIGHT =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='11'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='180' height='180' filter='url(%23g)'/></svg>\")"

/** White grain on ink. */
const GRAIN_DARK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='11'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='180' height='180' filter='url(%23g)'/></svg>\")"

export default function HomePage() {
  return (
    <main className="relative flex min-h-svh flex-col bg-background text-foreground lg:h-svh lg:flex-row lg:overflow-hidden">
      <section className="relative flex min-h-svh min-w-0 flex-col lg:min-h-0 lg:flex-1">
        {/* Hex field is out of flow so the hero can size to copy on small screens. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <HexFloat
            className="size-full"
            grain={0}
            iridescence={0.15}
            speed={0.15}
            tilt={6}
            bevel={1.5}
            shine={0.15}
          >
            <div aria-hidden className="size-full bg-background" />
          </HexFloat>
        </div>

        <div className="pointer-events-none relative z-1 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10 sm:py-20 md:px-14 lg:py-0">
          <div className="pointer-events-auto max-w-full">
            <TextureTitle>{site.name}</TextureTitle>
          </div>
          <p className="mt-6 max-w-xl text-[clamp(1.125rem,4.5vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] sm:mt-8">
            {site.tagline}
          </p>
          <ul className="mt-6 flex w-full max-w-80 flex-col gap-2 text-left text-sm leading-[1.4] tracking-[-0.01em] text-foreground sm:mt-8">
            {site.perks.map((perk) => (
              <li key={perk} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-[0.5em] size-[0.3rem] shrink-0 bg-foreground"
                />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative flex min-w-0 flex-col items-center justify-center gap-4 border-t border-border bg-background px-6 py-16 sm:px-8 sm:py-20 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:py-0">
        <WaitlistPanel />
      </section>

      {/* Topmost xerox wash — must sit above both panels or it only shows through gaps. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-size-[180px_180px] opacity-[0.06] dark:hidden"
        style={{ backgroundImage: GRAIN_LIGHT }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden bg-size-[180px_180px] opacity-[0.06] dark:block"
        style={{ backgroundImage: GRAIN_DARK }}
      />
    </main>
  )
}
