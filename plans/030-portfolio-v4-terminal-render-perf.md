# Plan 030: portfolio-v4 terminal memoizes its scrollback and bounds stored history

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 088cc3e..HEAD -- registry/new-york/templates/portfolio-v4 tests/templates/portfolio-v4`
> If any of those files changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `088cc3e`, 2026-09-07

## Why this matters

`portfolio-v4` is a new installable template: a bash-style terminal where the
visitor types commands (`about`, `work`, `resume`, `ls`, …) and formatted output
accumulates on screen. Two problems in the shipped code:

1. **Every keystroke re-renders the whole scrollback.** The text `input` state
   lives on `Terminal`, the same component that maps the `entries` array to
   `<TerminalLineView>` rows. `TerminalLineView` / `SegmentView` are plain
   function components (no `memo`). So each character typed re-invokes every
   line + segment component in the scrollback — 300–500 nodes after a visitor
   runs a handful of commands. On a phone this is visible input lag.
2. **`entries` is never trimmed.** `MAX_HISTORY = 100` caps only
   `commandHistory` (the ArrowUp/ArrowDown string list), not the rendered
   output. A long session grows memory without bound.

Fix 1 with `React.memo` on the row components: the `line` prop for each existing
row is referentially stable (entries are never mutated in place), so memoized
rows bail out of re-render on a keystroke and React does near-zero scrollback
work. Fix 2 by capping `entries` when new output is appended. No user-visible
behavior changes.

## Current state

Files:

- `registry/new-york/templates/portfolio-v4/components/terminal.tsx` — owns all
  terminal state and rendering. Relevant excerpts:

  ```tsx
  import {
    useEffect,
    useEffectEvent,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
  } from "react"

  import {
    getPromptPrefix,
    getWelcomeLines,
    runCommand,
    type TerminalLine,
  } from "../lib/commands"
  import { TerminalLineView } from "./terminal-line"

  import "../styles/terminal.css"

  const MAX_HISTORY = 100
  ```

  Inside `submitCommand(raw)` (the non-empty branch):
  ```tsx
  setCommandHistory((prev) => {
    const next = [...prev, trimmed]
    return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
  })
  setHistoryIndex(null)
  setDraft("")
  setInput("")

  const result = runCommand(
    trimmed,
    estimateCols(rootRef.current?.clientWidth ?? window.innerWidth)
  )

  if (result.kind === "clear") {
    resetScreen()
    return
  }

  setEntries((prev) => [
    ...prev,
    echo,
    ...(result.lines.length > 0
      ? [{ id: nextId(), kind: "output" as const, lines: result.lines }]
      : []),
  ])
  ```

  The empty-input branch (`if (!trimmed)`) sets `setInput("")` and
  `setHistoryIndex(null)` but **not** `setDraft("")` — a pre-existing minor bug
  (a stale draft survives a blank Enter). Fix it in Step 4 while you're here.

  The render maps entries:
  ```tsx
  {entries.map((entry) => (
    <div key={entry.id}>
      {entry.lines.map((line, index) => (
        <TerminalLineView key={`${entry.id}-${index}`} line={line} />
      ))}
    </div>
  ))}
  ```

- `registry/new-york/templates/portfolio-v4/components/terminal-line.tsx` — the
  whole file:

  ```tsx
  import type { LineSegment, TerminalLine } from "../lib/commands"

  function segmentClass(tone: LineSegment["tone"]): string {
    switch (tone) {
      case "bold": return "pt-bold"
      case "dim": return "pt-dim"
      case "cyan": return "pt-cyan"
      case "error": return "pt-error"
      case "default":
      case undefined: return ""
      default: {
        const _exhaustive: never = tone
        return _exhaustive
      }
    }
  }

  function SegmentView({ segment }: { segment: LineSegment }) {
    const className = segmentClass(segment.tone)
    if (segment.type === "link") {
      return (
        <a
          href={segment.href}
          target={segment.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={segment.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
          className={`pt-link ${className}`.trim()}
        >
          {segment.value}
        </a>
      )
    }
    if (!className) return <>{segment.value}</>
    return <span className={className}>{segment.value}</span>
  }

  export function TerminalLineView({ line }: { line: TerminalLine }) {
    const empty =
      line.segments.length === 0 ||
      line.segments.every((s) => s.type === "text" && s.value === "")
    if (empty) return <div className="pt-line" aria-hidden />
    return (
      <div className="pt-line">
        {line.segments.map((segment, index) => (
          <SegmentView key={`${segment.type}-${index}-${segment.value}`} segment={segment} />
        ))}
      </div>
    )
  }
  ```

- `registry/new-york/templates/portfolio-v4/lib/commands.ts` — pure logic module
  (parser, `runCommand`, `getWelcomeLines`, `getPromptPrefix`, types). Already
  exported and registered. Ends with:
  ```ts
  export function getPromptPrefix(): string {
    return "$ "
  }
  ```
- `tests/templates/portfolio-v4/commands.test.ts` — existing vitest suite for
  `lib/commands.ts`. Node environment. Imports via
  `@/registry/new-york/templates/portfolio-v4/lib/commands`.
- `public/r/portfolio-v4.json` — generated registry payload; embeds the full
  text `content` of every template file. Regenerated by `pnpm registry:build`.

### Repo conventions to match

- **`React.memo` exemplar**: `registry/new-york/blocks/gallery-section-v1/components/gallery-panel.tsx`
  line 3 `import { forwardRef, memo, useState } from "react"`, line 16
  `const GalleryPanel = memo(forwardRef<...>(function GalleryPanel(...) {`.
  Match: `import { memo } from "react"`, wrap with a named inner function.
- **Pure helpers belong in `lib/`, tested via a sibling `*.test.ts`** — see
  `lib/commands.ts` + `tests/templates/portfolio-v4/commands.test.ts`.
- Templates are self-contained: only import from within
  `registry/new-york/templates/portfolio-v4/`.

## Commands you will need

| Purpose           | Command                                                | Expected on success |
|-------------------|-------------------------------------------------------|---------------------|
| Install           | `pnpm install`                                        | exit 0              |
| Typecheck         | `pnpm typecheck`                                      | exit 0, no errors   |
| Targeted test     | `pnpm vitest run tests/templates/portfolio-v4`        | all pass            |
| Full tests        | `pnpm test:run`                                       | all pass (188 baseline + new) |
| Lint              | `pnpm lint`                                           | exit 0; 16 pre-existing warnings, none new |
| Registry build    | `pnpm registry:build`                                 | writes `public/r/*.json` |
| Registry validate | `pnpm registry:validate`                             | all items valid     |

Fresh worktree: run `pnpm install` first — `node_modules` is not shared.

## Scope

**In scope** (only these):
- `registry/new-york/templates/portfolio-v4/components/terminal-line.tsx` (modify)
- `registry/new-york/templates/portfolio-v4/components/terminal.tsx` (modify)
- `registry/new-york/templates/portfolio-v4/lib/commands.ts` (modify — additive
  only: new exports at the end, nothing existing changed)
- `tests/templates/portfolio-v4/commands.test.ts` (modify — add a `describe`)
- `public/r/portfolio-v4.json` (regenerated by `pnpm registry:build`, Step 5)

**Out of scope** (do NOT touch):
- Any other file in `registry/new-york/templates/portfolio-v4/` (`portfolio.ts`,
  `ascii.ts`, `styles/`, `app/`, `theme-provider.tsx`).
- `registry.json` — the template's file **list** does not change (no new files),
  so its `portfolio-v4` item needs no edit.
- Any other `public/r/*.json`, any other template or block.
- The command set, keybindings, welcome banner, or any visible output.
- `components/block-preview-by-version.tsx`, `template-preview-by-version.tsx`.

## Git workflow

- Branch: `advisor/030-portfolio-v4-terminal-render-perf`
- Commit per step or as one logical unit. Short imperative message; repo style is
  loose. Keep any `Co-Authored-By:` / `Claude-Session:` trailers your harness adds.
- Do NOT push or open a PR.

## Steps

### Step 1: Add tested history/scrollback bounds to `lib/commands.ts`

Append to the end of
`registry/new-york/templates/portfolio-v4/lib/commands.ts` (after
`getPromptPrefix`):

```ts
/** Max commands kept for ArrowUp/ArrowDown recall. */
export const MAX_COMMAND_HISTORY = 100

/**
 * Max output/input entry groups kept in the rendered scrollback. Older groups
 * fall off the top. Large enough that running every command once still shows
 * full output; bounded so a long session can't grow the DOM without limit.
 */
export const MAX_SCROLLBACK_ENTRIES = 60

/** Append `value`, keeping only the newest `MAX_COMMAND_HISTORY`. */
export function pushCommand(history: string[], value: string): string[] {
  const next = [...history, value]
  return next.length > MAX_COMMAND_HISTORY
    ? next.slice(-MAX_COMMAND_HISTORY)
    : next
}

/** Keep only the newest `MAX_SCROLLBACK_ENTRIES` entry groups. */
export function capScrollback<T>(entries: T[]): T[] {
  return entries.length > MAX_SCROLLBACK_ENTRIES
    ? entries.slice(-MAX_SCROLLBACK_ENTRIES)
    : entries
}
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Test the new helpers

In `tests/templates/portfolio-v4/commands.test.ts`, extend the imports and add
one `describe` block (match the file's existing style — `describe`/`it`,
`expect`):

```ts
import {
  MAX_COMMAND_HISTORY,
  MAX_SCROLLBACK_ENTRIES,
  capScrollback,
  getPromptPrefix,
  getWelcomeLines,
  pushCommand,
  runCommand,
  type TerminalLine,
} from "@/registry/new-york/templates/portfolio-v4/lib/commands"
```

```ts
describe("portfolio-v4 history + scrollback bounds", () => {
  it("pushCommand appends to the end", () => {
    expect(pushCommand(["a", "b"], "c")).toEqual(["a", "b", "c"])
  })

  it("pushCommand keeps only the newest MAX_COMMAND_HISTORY", () => {
    const full = Array.from({ length: MAX_COMMAND_HISTORY }, (_, i) => `c${i}`)
    const next = pushCommand(full, "newest")
    expect(next).toHaveLength(MAX_COMMAND_HISTORY)
    expect(next.at(-1)).toBe("newest")
    expect(next[0]).toBe("c1")
  })

  it("capScrollback returns the same array when under the cap", () => {
    const entries = [{ id: 1 }, { id: 2 }]
    expect(capScrollback(entries)).toBe(entries)
  })

  it("capScrollback drops the oldest groups past the cap", () => {
    const entries = Array.from(
      { length: MAX_SCROLLBACK_ENTRIES + 5 },
      (_, i) => ({ id: i })
    )
    const capped = capScrollback(entries)
    expect(capped).toHaveLength(MAX_SCROLLBACK_ENTRIES)
    expect(capped[0]).toEqual({ id: 5 })
  })
})
```

**Verify**: `pnpm vitest run tests/templates/portfolio-v4` → all pass, 4 new.

### Step 3: Memoize the scrollback row components

In `registry/new-york/templates/portfolio-v4/components/terminal-line.tsx`:

- Add above the existing type import: `import { memo } from "react"`
- Wrap `SegmentView` and the exported `TerminalLineView` in `memo(...)` with
  named inner functions, bodies unchanged:

  ```tsx
  const SegmentView = memo(function SegmentView({ segment }: { segment: LineSegment }) {
    /* body unchanged */
  })

  export const TerminalLineView = memo(function TerminalLineView({ line }: { line: TerminalLine }) {
    /* body unchanged */
  })
  ```

Do NOT add a custom `areEqual` comparator — default referential equality is
correct here.

**Verify**: `pnpm typecheck` → exit 0. `pnpm lint` → no new warning in this file.

### Step 4: Wire `terminal.tsx` to the helpers + fix the stale-draft nit

In `registry/new-york/templates/portfolio-v4/components/terminal.tsx`:

1. Import the helpers: add `MAX_COMMAND_HISTORY` is not needed directly — import
   `pushCommand` and `capScrollback` from `../lib/commands` (extend the existing
   import from that module).
2. Delete the local `const MAX_HISTORY = 100` line.
3. Replace the `setCommandHistory` updater in `submitCommand`'s non-empty branch:
   ```tsx
   setCommandHistory((prev) => pushCommand(prev, trimmed))
   ```
4. Wrap the scrollback append in `submitCommand`'s non-empty branch with
   `capScrollback`:
   ```tsx
   setEntries((prev) =>
     capScrollback([
       ...prev,
       echo,
       ...(result.lines.length > 0
         ? [{ id: nextId(), kind: "output" as const, lines: result.lines }]
         : []),
     ])
   )
   ```
5. In the empty-input branch (`if (!trimmed)`), add `setDraft("")` alongside the
   existing `setInput("")` / `setHistoryIndex(null)` so a blank Enter clears the
   saved draft, consistent with the non-empty branch.

Do not touch `resetScreen`, the effects, `onKeyDown`, or the render markup.

**Verify**:
- `pnpm typecheck` → exit 0
- `grep -n "MAX_HISTORY" registry/new-york/templates/portfolio-v4/components/terminal.tsx`
  → no matches
- `pnpm vitest run tests/templates/portfolio-v4` → all pass

### Step 5: Regenerate the registry payload

`public/r/portfolio-v4.json` embeds the text of `commands.ts`, `terminal.tsx`,
`terminal-line.tsx`, so it must be rebuilt.

1. `pnpm registry:build`
2. Stage only the intended file: `git add public/r/portfolio-v4.json`
3. Revert any other `public/r/*.json` the build rewrote (line-ending churn on a
   Windows checkout is common and unrelated):
   `git restore $(git diff --name-only -- public/r/ ':!public/r/portfolio-v4.json')`
   (if that glob syntax misbehaves, `git restore` each unrelated `public/r` file
   individually). The final `public/r/` diff must be `portfolio-v4.json` only.
4. Confirm `public/r/portfolio-v4.json`'s diff is limited to the `content`
   strings of the three files you changed — no reordered entries, no other files.

**Verify**:
- `pnpm registry:validate` → all items valid
- `git status --porcelain public/r/` → only `public/r/portfolio-v4.json`

### Step 6: Full verification

- `pnpm typecheck` → exit 0
- `pnpm lint` → exit 0, 16 warnings (unchanged), none in touched files
- `pnpm test:run` → all pass; `commands.test.ts` now has 4 more tests
- `pnpm registry:validate` → all items valid
- `git diff --stat 088cc3e..HEAD` → only the 5 in-scope paths

## Test plan

- Extend `tests/templates/portfolio-v4/commands.test.ts` with a
  `"portfolio-v4 history + scrollback bounds"` describe: `pushCommand` append +
  cap + oldest-dropped; `capScrollback` identity-under-cap + oldest-dropped.
- The re-render reduction is verified by diff review (memo on the row
  components; helpers wired in), not by a unit test — this repo's vitest has no
  DOM/renderer.
- Regression guard: the rest of `commands.test.ts` must pass unchanged (no
  behavior change).

## Done criteria

ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0; 16 warnings total, none in the touched files
- [ ] `pnpm test:run` exits 0; the 4 new tests in `commands.test.ts` pass; every
      pre-existing `commands.test.ts` test still passes
- [ ] `pnpm registry:validate` → all items valid
- [ ] `grep -n "memo(" registry/new-york/templates/portfolio-v4/components/terminal-line.tsx`
      → two matches (`SegmentView`, `TerminalLineView`)
- [ ] `grep -n "MAX_HISTORY\b" registry/new-york/templates/portfolio-v4/components/terminal.tsx`
      → no matches
- [ ] `git status --porcelain public/r/` → only `public/r/portfolio-v4.json`
- [ ] `git diff --stat 088cc3e..HEAD` shows only the 5 in-scope paths
- [ ] `plans/README.md` row updated (unless a reviewer owns the index)

## STOP conditions

Stop and report (do not improvise) if:

- "Current state" excerpts don't match the live files (drift since `088cc3e`).
- `pnpm registry:build` changes `public/r/portfolio-v4.json` in ways beyond the
  `content` of `commands.ts` / `terminal.tsx` / `terminal-line.tsx`, or leaves
  other `public/r/*.json` files that won't cleanly revert — report the diff.
- `pnpm typecheck` fails on the `useEffectEvent` import (it should not — it is
  valid at `088cc3e`); do not change that import yourself.
- Any verification fails twice after a reasonable fix attempt.

## Maintenance notes

- `MAX_SCROLLBACK_ENTRIES = 60` is a judgement call. No single command emits
  near that many entry groups today (`resume` is the largest, one group). If
  "scroll up through earlier output" becomes a product goal, revisit or switch
  to a line-count cap.
- Reviewer should confirm: purely structural change, no visible-output diff; the
  iframe autofocus guard and Ctrl+L/Ctrl+C handling in `terminal.tsx` are
  untouched.
- Deferred (Round 7 audit finding TESTS-02): moving `Terminal`'s input/history
  state into a `useReducer` (or its own component) for full unit-testability of
  the arrow-key navigation — a larger, separate change. `memo` already removes
  the per-keystroke scrollback cost without it.
