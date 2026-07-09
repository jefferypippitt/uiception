"use client"

import { useEffect, useRef } from "react"

/**
 * Delays hover-driven activation so sweeping across cards does not thrash
 * the morph. Focus / click should call the returned activate immediately
 * (pass `immediate: true`) for keyboard a11y.
 */
export function useHoverIntent<T>(
  onCommit: (value: T) => void,
  delayMs = 110
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCommitRef = useRef(onCommit)

  useEffect(() => {
    onCommitRef.current = onCommit
  }, [onCommit])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [])

  const schedule = (value: T) => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      onCommitRef.current(value)
    }, delayMs)
  }

  const commit = (value: T) => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    onCommitRef.current(value)
  }

  const cancel = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  return { schedule, commit, cancel }
}
