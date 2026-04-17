"use client"

/**
 * Product surface: Members admin — breadcrumb + rail + table (Name · Role · Save).
 * Story: hover role → open dropdown (Admin / Editor / Publisher / User) → pick Editor → Save.
 */

import {
  ChevronDown,
  ChevronRight,
  KeyRound,
  Loader,
  Shield,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { useFsv2IllustrationActive } from "../hooks/use-fsv2-illustration-active"
import {
  ROLE_MENU_OPTIONS,
  useAccessAnimation,
  type MemberRole,
} from "../hooks/use-access-animation"
import { Cursor } from "./cursor"

type RowDef = {
  id: string
  name: string
  role: MemberRole
  isTarget: boolean
}

const TABLE_ROWS: readonly RowDef[] = [
  { id: "r0", name: "John Doe", role: "Admin", isTarget: false },
  { id: "r1", name: "Jane Smith", role: "User", isTarget: true },
  { id: "r2", name: "Alex Brown", role: "Publisher", isTarget: false },
]

function roleCellClass(role: MemberRole, isTarget: boolean) {
  if (role === "Admin" || (role === "User" && isTarget) || (isTarget && role === "Editor")) {
    return "text-foreground"
  }
  return "text-muted-foreground"
}

export default function AccessControlIllustration() {
  const active = useFsv2IllustrationActive()
  const {
    stage,
    targetRole,
    dropdownOpen,
    cursor,
    cursorVisible,
    pressed,
    rowHighlight,
    roleCellHot,
    saveHot,
    isSaving,
    isResult,
  } = useAccessAnimation(active)

  return (
    <div className="flex size-full flex-col overflow-visible rounded-lg border border-border bg-card">
      <header className="flex h-7 shrink-0 items-center gap-1 border-b border-border px-2">
        <nav
          className="flex min-w-0 flex-1 items-center gap-0.5 text-[10px] leading-none"
          aria-label="Breadcrumb"
        >
          <span className="shrink-0 text-muted-foreground">Settings</span>
          <ChevronRight className="size-2.5 shrink-0 text-muted-foreground/70" aria-hidden />
          <span className="shrink-0 text-muted-foreground">Members</span>
          <ChevronRight className="size-2.5 shrink-0 text-muted-foreground/70" aria-hidden />
          <span className="min-w-0 truncate text-muted-foreground">Directory</span>
          <ChevronRight className="size-2.5 shrink-0 text-muted-foreground/70" aria-hidden />
          <span className="shrink-0 font-medium text-foreground">Roles</span>
        </nav>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className="flex w-7 shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/25 py-1.5"
          aria-hidden
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-foreground">
            <Users className="size-3" aria-hidden />
          </span>
          <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground">
            <Shield className="size-3" aria-hidden />
          </span>
          <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground">
            <KeyRound className="size-3" aria-hidden />
          </span>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col px-2 py-1.5">
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_5.75rem_3.25rem] gap-x-1 border-b border-border bg-muted/30 px-1.5 py-1 text-[8px] font-medium uppercase tracking-wide text-muted-foreground">
            <span>Name</span>
            <span className="text-center">Role</span>
            <span className="text-center">Action</span>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col rounded-md border border-x border-b border-border bg-background/40">
            {TABLE_ROWS.map((row) => {
              const isTarget = row.isTarget
              const displayRole: MemberRole = isTarget ? targetRole : row.role

              const showRowGlow = isTarget && rowHighlight
              const showRoleHot = isTarget && roleCellHot
              const showSaveHot = isTarget && saveHot
              const saveEnabled =
                isTarget && targetRole === "Editor" && !isResult && !isSaving
              const saveDisabled = isResult || targetRole === "User"

              return (
                <div
                  key={row.id}
                  className={cn(
                    "relative flex min-h-0 flex-1 items-stretch border-b border-border last:border-b-0",
                    showRowGlow && "bg-muted/35",
                  )}
                >
                  <div className="grid min-h-0 w-full grid-cols-[minmax(0,1fr)_5.75rem_3.25rem] items-center gap-x-1 px-1.5 py-0.5">
                    <span className="truncate text-[10px] font-medium text-foreground">
                      {row.name}
                    </span>

                    <div className="relative flex justify-center">
                      <span
                        className={cn(
                          "inline-flex min-w-11 items-center justify-center gap-0.5 rounded-md border px-1 py-0.5 text-[9px] font-medium transition-colors duration-200",
                          showRoleHot && "border-foreground/30 bg-muted/80 ring-1 ring-foreground/10",
                          !showRoleHot && "border-transparent",
                        )}
                      >
                        <span className={roleCellClass(displayRole, isTarget)}>
                          {displayRole}
                        </span>
                        {isTarget ? (
                          <ChevronDown
                            className={cn(
                              "size-2.5 shrink-0 text-muted-foreground transition-transform duration-200",
                              dropdownOpen && "rotate-180",
                            )}
                            aria-hidden
                          />
                        ) : null}
                      </span>

                      {isTarget && dropdownOpen ? (
                        <div
                          className="absolute bottom-full left-1/2 z-20 mb-0.5 w-21 -translate-x-1/2 rounded-md border border-border bg-card py-0.5 shadow-sm"
                          aria-hidden
                        >
                          {ROLE_MENU_OPTIONS.map((opt) => (
                            <div
                              key={opt}
                              className={cn(
                                "px-1.5 py-1 text-center text-[9px] font-medium transition-colors",
                                opt === "Editor" && stage === "menuEditorHover"
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex justify-center">
                      {isTarget ? (
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-hidden
                          className={cn(
                            "inline-flex h-5 min-w-11 items-center justify-center gap-0.5 rounded-md border px-1 text-[9px] font-medium transition-colors",
                            isResult
                              ? "border-border bg-muted/40 text-foreground"
                              : saveEnabled || isSaving
                                ? showSaveHot
                                  ? "border-foreground/35 bg-muted text-foreground"
                                  : "border-border bg-card text-foreground"
                                : "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/50",
                          )}
                          disabled={saveDisabled || isSaving}
                        >
                          {isResult ? (
                            "Saved"
                          ) : isSaving ? (
                            <Loader className="size-2.5 shrink-0 motion-safe:animate-spin" aria-hidden />
                          ) : (
                            "Save"
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex h-5 min-w-11 items-center justify-center rounded-md border border-border bg-muted/30 text-[9px] text-muted-foreground/60">
                          Save
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {cursorVisible ? (
              <Cursor x={cursor.x} y={cursor.y} pressed={pressed} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
