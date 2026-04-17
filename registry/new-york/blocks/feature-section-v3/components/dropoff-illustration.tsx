"use client"

import { CircleCheck, Loader, PanelRightOpen, Smartphone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { useDropoffAnimation } from "../hooks/use-dropoff-animation"
import { useFsv3IllustrationActive } from "../hooks/use-fsv3-illustration-active"
import { Cursor } from "./cursor"

export default function DropoffIllustration() {
  const active = useFsv3IllustrationActive()
  const { cursor, cursorVisible, pressed, showPhone, showReasonPanel, isResult } =
    useDropoffAnimation(active)

  return (
    <div className="relative flex size-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex h-7 shrink-0 items-center border-b border-border px-2.5">
        {isResult ? (
          <Badge className="h-4 gap-1 border-transparent bg-purple-500/10 px-1.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">
            <CircleCheck className="size-2.5" aria-hidden />
            Cause found
          </Badge>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px]">
            <Loader className="size-2.5 shrink-0 text-muted-foreground motion-safe:animate-spin" aria-hidden />
            <span className="text-muted-foreground">Investigating</span>
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1 gap-1.5 p-1.5">
        <Card className="min-h-0 flex-1 gap-0 border-border bg-background/65 py-0 shadow-none">
          <CardContent className="flex min-h-0 flex-col gap-1 p-1.5">
            <Table>
              <TableHeader>
                <TableRow className="h-5 hover:bg-transparent">
                  <TableHead className="py-0 text-[8px] text-muted-foreground">Step</TableHead>
                  <TableHead className="py-0 text-[8px] text-muted-foreground">People</TableHead>
                  <TableHead className="py-0 text-right text-[8px] text-muted-foreground">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="h-6">
                  <TableCell className="py-0 text-[10px] text-foreground">Start</TableCell>
                  <TableCell className="py-0 font-mono text-[10px] tabular-nums text-foreground">
                    12,482
                  </TableCell>
                  <TableCell className="py-0 text-right text-[10px] text-muted-foreground">Low</TableCell>
                </TableRow>
                <TableRow className={cn("h-6 transition-colors duration-200", showPhone && "bg-purple-500/8")}>
                  <TableCell
                    className={cn(
                      "py-0 text-[10px]",
                      showPhone ? "font-medium text-purple-600 dark:text-purple-400" : "text-foreground",
                    )}
                  >
                    Phone
                  </TableCell>
                  <TableCell className="py-0 font-mono text-[10px] tabular-nums text-foreground">
                    7,941
                  </TableCell>
                  <TableCell className="py-0 text-right text-[10px]">
                    {showPhone ? (
                      <span className="font-medium text-purple-600 dark:text-purple-400">High</span>
                    ) : (
                      <Skeleton className="ml-auto h-2 w-8" />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="h-6">
                  <TableCell className={cn("py-0 text-[10px]", isResult && "text-muted-foreground/50 line-through")}>
                    Review
                  </TableCell>
                  <TableCell className={cn("py-0 font-mono text-[10px] tabular-nums", isResult ? "text-muted-foreground/50" : "text-foreground")}>
                    {isResult ? "4,212" : "—"}
                  </TableCell>
                  <TableCell className="py-0 text-right text-[10px] text-muted-foreground">
                    {isResult ? "—" : <Skeleton className="ml-auto h-2 w-7" />}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="flex w-[42%] min-w-[82px] flex-col gap-0 border-border bg-muted/20 py-0 shadow-none">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-1 p-1.5">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <Smartphone className="size-2.5" aria-hidden />
              <span>Phone step impact</span>
            </div>
            <Progress
              value={isResult ? 78 : showReasonPanel ? 59 : 22}
              className="h-1 **:data-[slot=progress-indicator]:bg-purple-500/80"
            />
            <Separator />
            <div className="flex min-h-0 flex-1 flex-col justify-center text-[9px] leading-snug text-muted-foreground">
              {showReasonPanel ? (
                <>
                  <span className="font-medium text-foreground">Problem source</span>
                  <span className="mt-0.5">Phone validation blocks checkout on iOS Safari.</span>
                </>
              ) : (
                <span>Select a row to see the strongest drop-off reason.</span>
              )}
            </div>
            <div className="inline-flex items-center gap-1 text-[9px]">
              <PanelRightOpen className="size-2.5 text-muted-foreground" aria-hidden />
              <span className={cn("truncate", isResult ? "text-foreground" : "text-muted-foreground")}>
                {isResult ? "Fix phone first" : "Awaiting clue"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="flex h-6 shrink-0 items-center gap-1.5 px-2.5 text-[10px]">
        {isResult && (
          <span className="truncate font-medium text-foreground">Phone step loses 46%</span>
        )}
      </footer>

      {cursorVisible ? <Cursor x={cursor.x} y={cursor.y} pressed={pressed} /> : null}
    </div>
  )
}
