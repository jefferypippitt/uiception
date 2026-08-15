import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const CONTAINER = "mx-auto flex w-full max-w-5xl items-center px-6"

export function LifelineShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("flex h-dvh flex-col overflow-hidden bg-background text-foreground antialiased transition-colors duration-300",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function LifelineNav({
  logo,
  logoHref = "/",
  logoLabel = "Home",
  children,
  className,
  containerClassName,
}: {
  logo: ReactNode
  logoHref?: string
  logoLabel?: string
  children?: ReactNode
  className?: string
  containerClassName?: string
}) {
  return (
    <nav
      className={cn("fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300",
        className,
      )}
    >
      <div
        data-site-nav-inner
        className={cn(CONTAINER, "h-16 justify-between", containerClassName)}
      >
        <a
          href={logoHref}
          data-site-nav-logo
          aria-label={logoLabel}
          className="text-foreground transition-[color,opacity] duration-300 hover:opacity-70"
        >
          {logo}
        </a>

        {children ? (
          <div className="flex items-center gap-8">{children}</div>
        ) : null}
      </div>
    </nav>
  )
}

export function LifelineStage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <main
      className={cn("flex-1 min-h-0 overflow-y-auto pt-16 md:overflow-hidden",
        className,
      )}
    >
      {children}
    </main>
  )
}

export function LifelineFooter({
  children,
  className,
  containerClassName,
}: {
  children?: ReactNode
  className?: string
  containerClassName?: string
}) {
  return (
    <footer
      className={cn("shrink-0 border-t border-border bg-background/95 backdrop-blur-sm transition-colors duration-300",
        className,
      )}
    >
      <div
        className={cn(
          CONTAINER,
          "h-16 justify-between gap-6",
          containerClassName,
        )}
      >
        {children}
      </div>
    </footer>
  )
}
