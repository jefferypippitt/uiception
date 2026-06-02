"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeCookieSyncer() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme) {
      document.cookie = `theme=${resolvedTheme};path=/;max-age=31536000;SameSite=Lax`
    }
  }, [resolvedTheme])

  return null
}
