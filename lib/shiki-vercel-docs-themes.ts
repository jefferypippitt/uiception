import type { ThemeRegistration } from "shiki"

import vercelDocsDarkSource from "./shiki-themes/vercel-docs-dark.source.json"
import vercelDocsLightSource from "./shiki-themes/vercel-docs-light.source.json"

export const SHIKI_THEME_VERCEL_DARK = "vercel-docs-dark"
export const SHIKI_THEME_VERCEL_LIGHT = "vercel-docs-light"

export const vercelDocsShikiThemes: ThemeRegistration[] = [
  { ...vercelDocsDarkSource, name: SHIKI_THEME_VERCEL_DARK, type: "dark" },
  { ...vercelDocsLightSource, name: SHIKI_THEME_VERCEL_LIGHT, type: "light" },
]
