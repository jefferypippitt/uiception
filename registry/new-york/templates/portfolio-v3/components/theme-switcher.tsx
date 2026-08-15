"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useIsClient()

  if (!mounted) {
    return <span className="inline-block h-4 w-4" aria-hidden="true" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("inline-flex items-center p-0 text-muted-foreground transition-colors duration-300 hover:text-foreground",
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  )
}
