"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const STORAGE_KEY = "uiception.terminal.soundEnabled"

type SoundPreferenceValue = {
  soundEnabled: boolean
  setSoundEnabled: (next: boolean) => void
  toggleSound: () => void
}

const SoundPreferenceContext = createContext<SoundPreferenceValue | null>(null)

export function SoundPreferenceProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === "0") return false
      if (raw === "1") return true
    } catch {
      // ignore
    }
    return true
  })

  const setSoundEnabled = useCallback((next: boolean) => {
    setSoundEnabledState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // ignore
    }
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const value = useMemo<SoundPreferenceValue>(
    () => ({
      soundEnabled,
      setSoundEnabled,
      toggleSound,
    }),
    [soundEnabled, setSoundEnabled, toggleSound],
  )

  return (
    <SoundPreferenceContext.Provider value={value}>
      {children}
    </SoundPreferenceContext.Provider>
  )
}

/** Throws if used outside {@link SoundPreferenceProvider}. */
export function useSoundPreference(): SoundPreferenceValue {
  const ctx = useContext(SoundPreferenceContext)
  if (!ctx) {
    throw new Error("useSoundPreference must be used within SoundPreferenceProvider")
  }
  return ctx
}

/**
 * When inside {@link SoundPreferenceProvider}, returns the user's global toggle.
 * Otherwise defaults to `true` so existing `useSound` callers keep working.
 */
export function useOptionalSoundPreference(): boolean {
  const ctx = useContext(SoundPreferenceContext)
  return ctx?.soundEnabled ?? true
}
