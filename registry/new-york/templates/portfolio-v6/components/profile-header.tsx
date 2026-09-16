import { Avatar } from "./avatar"
import { portfolio } from "../lib/portfolio"

export function ProfileHeader() {
  return (
    <header className="flex items-center gap-3" data-resume-header>
      <div className="shrink-0 will-change-transform" data-resume-avatar>
        <Avatar className="size-14" />
      </div>
      <div className="min-w-0">
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {portfolio.name}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{portfolio.title}</p>
      </div>
    </header>
  )
}
