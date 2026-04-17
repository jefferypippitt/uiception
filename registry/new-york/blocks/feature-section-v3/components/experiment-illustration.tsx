"use client"

import { GitCommitHorizontal, Loader, TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { useExperimentAnimation } from "../hooks/use-experiment-animation"
import { useFsv3IllustrationActive } from "../hooks/use-fsv3-illustration-active"
import { Cursor } from "./cursor"

const ORIGINAL_RATE = "12.4%"
const NEW_RATE = "14.1%"
const LIFT = "+1.7 pts"

export default function ExperimentIllustration() {
  const active = useFsv3IllustrationActive()
  const {
    isResult,
    progressPct,
    cursor,
    cursorVisible,
    pressed,
  } = useExperimentAnimation(active)

  return (
    <div className="relative flex size-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-1.5">
        <Card className="gap-0 border-border bg-background/65 py-0 shadow-none">
          <CardContent className="flex items-center gap-1.5 px-2 py-1.5">
            <GitCommitHorizontal className="size-3 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-[9px] text-muted-foreground">From latest update</p>
              <p className="truncate font-mono text-[10px] text-foreground">signup-phone-fix</p>
            </div>
            <span className="ml-auto font-mono text-[9px] tabular-nums text-muted-foreground">v2.8.4</span>
          </CardContent>
        </Card>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5">
          <Card className="min-h-0 gap-0 border-border bg-muted/20 py-0 shadow-none">
            <CardContent className="flex min-h-0 flex-1 flex-col gap-1 px-2 py-1.5">
              <Label className="text-[9px] font-normal text-muted-foreground">Original</Label>
              <p className="text-[17px] leading-none font-medium tabular-nums text-foreground">{ORIGINAL_RATE}</p>
              <Progress
                value={62}
                className="mt-auto h-1 **:data-[slot=progress-indicator]:bg-foreground/35"
              />
            </CardContent>
          </Card>

          <Card
            className={cn(
              "min-h-0 gap-0 border py-0 shadow-none transition-colors duration-200",
              isResult ? "border-green-500/35 bg-green-500/7" : "border-border bg-muted/20",
            )}
          >
            <CardContent className="flex min-h-0 flex-1 flex-col gap-1 px-2 py-1.5">
              <Label className={cn("text-[9px] font-normal", isResult ? "text-green-600 dark:text-green-500" : "text-muted-foreground")}>
                New
              </Label>
              {isResult ? (
                <p className="text-[17px] leading-none font-medium tabular-nums text-green-600 dark:text-green-500">
                  {NEW_RATE}
                </p>
              ) : (
                <Skeleton className="h-[17px] w-12 rounded-sm" />
              )}
              <Progress
                value={Math.min(progressPct, 100)}
                className={cn(
                  "mt-auto h-1",
                  isResult
                    ? "**:data-[slot=progress-indicator]:bg-green-500/80"
                    : "**:data-[slot=progress-indicator]:bg-foreground/45",
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-2 px-0.5 text-[9px]">
          <span className="text-muted-foreground">Who sees which version</span>
          <span className="font-mono tabular-nums text-foreground">{Math.min(progressPct, 100)}%</span>
        </div>
        <Progress value={Math.min(progressPct, 100)} className="h-1 **:data-[slot=progress-indicator]:bg-green-500/75" />
      </div>

      <footer className="flex h-6 shrink-0 items-center gap-1.5 px-2.5 text-[10px]">
        {isResult ? (
          <>
            <TrendingUp className="size-2.5 shrink-0 text-green-600 dark:text-green-500" aria-hidden />
            <span className="truncate text-muted-foreground">
              Clear winner · <span className="font-medium text-foreground">{LIFT}</span>
            </span>
          </>
        ) : (
          <>
            <Loader className="size-2.5 shrink-0 text-muted-foreground motion-safe:animate-spin" aria-hidden />
            <span className="text-muted-foreground">Running test</span>
          </>
        )}
      </footer>

      {cursorVisible ? <Cursor x={cursor.x} y={cursor.y} pressed={pressed} /> : null}
    </div>
  )
}
