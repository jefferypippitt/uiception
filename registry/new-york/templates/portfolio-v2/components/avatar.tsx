import { existsSync } from "node:fs"
import { join } from "node:path"
import Image from "next/image"

const AVATAR_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"] as const

function resolveAvatarSrc(): string | null {
  // After install: drop public/avatar.png (any supported extension).
  const installDir = join(process.cwd(), "public")
  for (const ext of AVATAR_EXTENSIONS) {
    const filename = `avatar${ext}`
    if (existsSync(join(installDir, filename))) {
      return `/${filename}`
    }
  }

  // Monorepo preview / site demo (Next only serves root public/).
  // Same idea as public/images/blocks/<block-id>/.
  const demoDir = join(
    process.cwd(),
    "public",
    "images",
    "templates",
    "portfolio-v2"
  )
  for (const ext of AVATAR_EXTENSIONS) {
    const filename = `avatar${ext}`
    if (existsSync(join(demoDir, filename))) {
      return `/images/templates/portfolio-v2/${filename}`
    }
  }

  return null
}

export function Avatar() {
  const src = resolveAvatarSrc()

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={48}
        height={48}
        unoptimized
        className="size-12 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <span
      aria-hidden
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium tracking-tight text-foreground"
    >
      JD
    </span>
  )
}
