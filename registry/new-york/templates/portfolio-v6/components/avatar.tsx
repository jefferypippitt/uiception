import Image from "next/image"

import { resolveAvatarSrc } from "../lib/media"

export function Avatar({ className = "size-14" }: { className?: string }) {
  const src = resolveAvatarSrc()

  return (
    <Image
      src={src}
      alt=""
      width={56}
      height={56}
      unoptimized
      priority
      loading="eager"
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  )
}
