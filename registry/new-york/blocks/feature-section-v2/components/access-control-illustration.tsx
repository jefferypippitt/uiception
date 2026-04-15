"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

import { useFsv2IllustrationActive }     from "../hooks/use-fsv2-illustration-active"
import { useAccessAnimation, ROLE_META } from "../hooks/use-access-animation"
import type { Role }                     from "../hooks/use-access-animation"
import "../styles/access-control-illustration.css"

const ROLE_BAR: Record<Role, string> = {
  admin:  "100%",
  editor: "75%",
  mod:    "55%",
  member: "35%",
  viewer: "0%",
}

const ROLE_LEVEL: Record<Role, string> = {
  admin:  "4/4",
  editor: "3/4",
  mod:    "2/4",
  member: "1/4",
  viewer: "0/4",
}

function CursorSvg() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
      <path
        d="M1.5 1 L1.5 10.5 L4 7.8 L6.1 12 L7.6 11.3 L5.5 7.1 L9 7.1 Z"
        fill="white"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="0.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AccessControlIllustration() {
  const { ref: rootRef, active }                           = useFsv2IllustrationActive()
  const { users, roles, flashIdx, cursorTarget, cursorPhase } = useAccessAnimation(active)

  // Refs for each row's role pill
  const pillRefs  = useRef<Array<HTMLSpanElement | null>>([])
  const windowRef = useRef<HTMLDivElement>(null)

  // Cursor position in px relative to .acl-window top-left
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)

  // Re-position cursor whenever the target changes
  useEffect(() => {
    if (cursorTarget === null || !windowRef.current) return
    const pill = pillRefs.current[cursorTarget]
    if (!pill) return

    const winRect  = windowRef.current.getBoundingClientRect()
    const pillRect = pill.getBoundingClientRect()

    // Offset by the SVG tip coords (1.5, 1) so the arrow point lands at pill center
    setCursorPos({
      x: pillRect.left - winRect.left + pillRect.width  * 0.5 - 1.5,
      y: pillRect.top  - winRect.top  + pillRect.height * 0.5 - 1,
    })
  }, [cursorTarget])

  // Seed initial cursor position at Sarah's pill on mount
  useEffect(() => {
    if (!windowRef.current) return
    const pill = pillRefs.current[0]
    if (!pill) return

    const winRect  = windowRef.current.getBoundingClientRect()
    const pillRect = pill.getBoundingClientRect()

    // Offset by the SVG tip coords (1.5, 1) so the arrow point lands at pill center
    setCursorPos({
      x: pillRect.left - winRect.left + pillRect.width  * 0.5 - 1.5,
      y: pillRect.top  - winRect.top  + pillRect.height * 0.5 - 1,
    })
  }, [])

  const isHovering = (i: number) =>
    cursorTarget === i && (cursorPhase === "hover" || cursorPhase === "click")

  const cursorVisible = cursorPhase !== "idle"

  return (
    <div ref={rootRef} className="acl-root">
      <div ref={windowRef} className="acl-window">

        {/* ── Member table ── */}
        <div className="acl-table">
          <div className="acl-thead" aria-hidden>
            <span className="acl-th acl-th--member">Member</span>
            <span className="acl-th acl-th--role">Role</span>
            <span className="acl-th acl-th--access">Access</span>
            <span className="acl-th acl-th--level">Level</span>
          </div>
          <div className="acl-rows">
            {users.map((user, i) => {
              const role = roles[i]!
              return (
                <div
                  key={user.initials}
                  className={cn("acl-tr", flashIdx === i && "acl-tr--flash")}
                >
                  <span className="acl-name">{user.name}</span>
                  <span
                    ref={el => { pillRefs.current[i] = el }}
                    className={cn(
                      "acl-role-pill",
                      `acl-role-pill--${role}`,
                      isHovering(i) && "acl-role-pill--cursor-hover",
                    )}
                  >
                    {ROLE_META[role].label}
                  </span>
                  <div className="acl-bar-wrap" aria-hidden>
                    <div
                      className={cn("acl-bar-fill", `acl-bar-fill--${role}`)}
                      style={{ width: ROLE_BAR[role] }}
                    />
                  </div>
                  <span className={cn("acl-level", `acl-level--${role}`)}>
                    {ROLE_LEVEL[role]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Cursor ── */}
        {cursorPos && (
          <div
            className={cn(
              "acl-cursor",
              !cursorVisible      && "acl-cursor--hidden",
              cursorPhase === "click" && "acl-cursor--clicking",
            )}
            style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}
            aria-hidden
          >
            <div className={cn(
              "acl-cursor-icon",
              cursorPhase === "click" && "acl-cursor-icon--click",
            )}>
              <CursorSvg />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
