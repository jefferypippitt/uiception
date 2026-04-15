"use client"

import { useEffect, useRef, useState } from "react"

export type Role        = "admin" | "editor" | "mod" | "member" | "viewer"
export type CursorPhase = "idle" | "approach" | "hover" | "click" | "pause"

export interface AclUser {
  initials:    string
  name:        string
  avatarColor: string
}

export const USERS: AclUser[] = [
  { initials: "JD", name: "John Doe",   avatarColor: "#7c3aed" },
  { initials: "JS", name: "Jane Smith", avatarColor: "#2563eb" },
  { initials: "BB", name: "Bob Brown",  avatarColor: "#d97706" },
  { initials: "AJ", name: "Alice Jones", avatarColor: "#0e7490" },
]

export const ROLE_META: Record<Role, { label: string; read: boolean; write: boolean; manage: boolean }> = {
  admin:  { label: "Admin",  read: true,  write: true,  manage: true  },
  editor: { label: "Editor", read: true,  write: true,  manage: false },
  mod:    { label: "Mod",    read: true,  write: true,  manage: false },
  member: { label: "Member", read: true,  write: false, manage: false },
  viewer: { label: "Viewer", read: true,  write: false, manage: false },
}

const SEQUENCE: [number, Role][] = [
  [1, "admin"],
  [2, "editor"],
  [3, "member"],
  [2, "mod"],
  [3, "viewer"],
  [1, "editor"],
  [3, "mod"],
  [2, "member"],
  [1, "mod"],
  [3, "editor"],
]

const INITIAL_ROLES: Role[] = ["admin", "editor", "member", "mod"]

const APPROACH_MS = 700
const HOVER_MS    = 420
const CLICK_MS    = 300
const PAUSE_MS    = 1600
const FLASH_MS    = 500

// ─────────────────────────────────────────────────────────────────────────────

export function useAccessAnimation(active: boolean) {
  const [roles,        setRoles]        = useState<Role[]>(INITIAL_ROLES)
  const [flashIdx,     setFlashIdx]     = useState<number | null>(null)
  const [cursorTarget, setCursorTarget] = useState<number | null>(null)
  const [cursorPhase,  setCursorPhase]  = useState<CursorPhase>("idle")

  const seqRef    = useRef(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!active) return

    const push = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms)
      timersRef.current.push(t)
    }

    function runNext() {
      const [userIdx, newRole] = SEQUENCE[seqRef.current % SEQUENCE.length]!
      seqRef.current++

      // 1. Approach — cursor starts moving toward target pill
      setCursorTarget(userIdx)
      setCursorPhase("approach")

      push(() => {
        // 2. Hover — cursor has arrived, lingering
        setCursorPhase("hover")

        push(() => {
          // 3. Click — role changes, flash fires
          setCursorPhase("click")
          setRoles(prev => prev.map((r, i) => (i === userIdx ? newRole : r)))
          setFlashIdx(userIdx)
          push(() => setFlashIdx(null), FLASH_MS)

          push(() => {
            // 4. Pause — cursor stays put before next action
            setCursorPhase("pause")
            push(runNext, PAUSE_MS)
          }, CLICK_MS)
        }, HOVER_MS)
      }, APPROACH_MS)
    }

    // Short initial delay before first action
    push(runNext, 800)

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      setCursorPhase("idle")
      setCursorTarget(null)
    }
  }, [active])

  return { users: USERS, roles, flashIdx, cursorTarget, cursorPhase }
}
