import { existsSync } from "node:fs"
import { join } from "node:path"
import Image from "next/image"

const AVATAR_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"] as const

function resolveAvatarSrc(): string | null {
  const installDir = join(process.cwd(), "public")
  for (const ext of AVATAR_EXTENSIONS) {
    const filename = `avatar${ext}`
    if (existsSync(join(installDir, filename))) {
      return `/${filename}`
    }
  }

  const demoDir = join(
    process.cwd(),
    "public",
    "images",
    "templates",
    "portfolio-v3",
  )
  for (const ext of AVATAR_EXTENSIONS) {
    const filename = `avatar${ext}`
    if (existsSync(join(demoDir, filename))) {
      return `/images/templates/portfolio-v3/${filename}`
    }
  }

  return null
}

export function Avatar({ className = "size-10" }: { className?: string }) {
  const src = resolveAvatarSrc()

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={40}
        height={40}
        unoptimized
        priority
        loading="eager"
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tracking-tight text-foreground ${className}`}
    >
      JD
    </span>
  )
}
