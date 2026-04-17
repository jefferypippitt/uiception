"use client"

import { useEffect, useState } from "react"

/**
 * Members table: hover role → open dropdown → cursor picks Editor → Save.
 * `targetRole` stays User until Editor is chosen (no flick in the cell).
 * Cursor % are relative to the bordered table body.
 */

export type AccessPhase =
  | "setup"
  | "acting"
  | "result"
  | "holding"
  | "resetting"

const TIMING: Record<AccessPhase, number> = {
  setup: 500,
  acting: 3400,
  result: 320,
  holding: 2800,
  resetting: 320,
}

export type AccessTableStage =
  | "idle"
  | "roleHover"
  | "menuOpen"
  | "menuEditorHover"
  | "editorPicked"
  | "saveHover"
  | "saving"

/** Role options in the dropdown (top → bottom). */
export type MemberRole = "Admin" | "Editor" | "Publisher" | "User"

export const ROLE_MENU_OPTIONS: readonly MemberRole[] = [
  "Admin",
  "Editor",
  "Publisher",
  "User",
]

export const ACCESS_TABLE_CURSOR = {
  role: { x: 71, y: 50 },
  /** Editor row in the drop-up menu (second item). */
  menuEditor: { x: 72, y: 42 },
  save: { x: 91, y: 50 },
} as const

export function useAccessAnimation(active: boolean) {
  const [phase, setPhase] = useState<AccessPhase>("setup")
  const [stage, setStage] = useState<AccessTableStage>("idle")
  const [targetRole, setTargetRole] = useState<MemberRole>("User")
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!active) return

    const next: Record<AccessPhase, AccessPhase> = {
      setup: "acting",
      acting: "result",
      result: "holding",
      holding: "resetting",
      resetting: "setup",
    }

    const t = setTimeout(() => setPhase(next[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  useEffect(() => {
    if (!active) return

    if (phase === "setup" || phase === "resetting") {
      setStage("idle")
      setTargetRole("User")
      setPressed(false)
      return
    }

    if (phase === "result" || phase === "holding") {
      setStage("idle")
      setPressed(false)
      return
    }

    if (phase !== "acting") return

    const timers: ReturnType<typeof setTimeout>[] = []

    setStage("roleHover")

    timers.push(setTimeout(() => setStage("menuOpen"), 480))
    timers.push(
      setTimeout(() => {
        setPressed(true)
      }, 520),
    )
    timers.push(setTimeout(() => setPressed(false), 620))

    timers.push(setTimeout(() => setStage("menuEditorHover"), 980))

    timers.push(
      setTimeout(() => {
        setStage("editorPicked")
        setTargetRole("Editor")
        setPressed(true)
      }, 1480),
    )
    timers.push(setTimeout(() => setPressed(false), 1600))

    timers.push(setTimeout(() => setStage("saveHover"), 1780))

    timers.push(
      setTimeout(() => {
        setStage("saving")
        setPressed(true)
      }, 2280),
    )
    timers.push(setTimeout(() => setPressed(false), 2420))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [active, phase])

  /** Menu visible; cell text stays User until `editorPicked` closes it. */
  const dropdownOpen =
    phase === "acting" &&
    (stage === "menuOpen" || stage === "menuEditorHover")

  const cursorVisible = phase === "acting" && stage !== "idle"

  const cursorAtSave = stage === "saveHover" || stage === "saving"
  const cursorAtMenuEditor =
    stage === "menuEditorHover" || stage === "editorPicked"

  const cursor = cursorAtSave
    ? ACCESS_TABLE_CURSOR.save
    : cursorAtMenuEditor
      ? ACCESS_TABLE_CURSOR.menuEditor
      : ACCESS_TABLE_CURSOR.role

  const rowHighlight =
    phase === "acting" &&
    stage !== "idle" &&
    stage !== "roleHover"

  const roleCellHot =
    phase === "acting" &&
    (stage === "roleHover" ||
      stage === "menuOpen" ||
      stage === "menuEditorHover")

  const saveHot =
    phase === "acting" && (stage === "saveHover" || stage === "saving")

  return {
    phase,
    stage,
    targetRole,
    dropdownOpen,
    cursor,
    cursorVisible,
    pressed,
    rowHighlight,
    roleCellHot,
    saveHot,
    isSaving: phase === "acting" && stage === "saving",
    isActing: phase === "acting",
    isResult: phase === "result" || phase === "holding",
    isHolding: phase === "holding",
  }
}
