import Image from "next/image"

import { resolveAvatarSrc } from "../lib/media"

export function Avatar({ className = "size-10" }: { className?: string }) {
  const src = resolveAvatarSrc()

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
