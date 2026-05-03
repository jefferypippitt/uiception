"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

const STORAGE_KEY = "uiception.terminal.soundEnabled"

const listeners = new Set<() => void>()

function emitSoundPreferenceChange() {
  listeners.forEach((listener) => {
    listener()
  })
}

function subscribe(callback: () => void) {
  listeners.add(callback)

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      emitSoundPreferenceChange()
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage)
  }

  return () => {
    listeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage)
    }
  }
}

function readSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === "0") return false
    if (raw === "1") return true
  } catch {
    // ignore
  }
  return true
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return true
  return readSoundEnabled()
}

/** Must match what the server renders so hydration succeeds */
function getServerSnapshot(): boolean {
  return true
}

type SoundPreferenceValue = {
  soundEnabled: boolean
  setSoundEnabled: (next: boolean) => void
  toggleSound: () => void
}

const SoundPreferenceContext = createContext<SoundPreferenceValue | null>(null)

export function SoundPreferenceProvider({ children }: { children: ReactNode }) {
  const soundEnabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const setSoundEnabled = useCallback((next: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // ignore
    }
    emitSoundPreferenceChange()
  }, [])

  const toggleSound = useCallback(() => {
    const next = !readSoundEnabled()
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // ignore
    }
    emitSoundPreferenceChange()
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
