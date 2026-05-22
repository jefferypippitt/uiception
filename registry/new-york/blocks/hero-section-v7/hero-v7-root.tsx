import type { HeroV7Props } from "./config"
import HeroContent from "./hero-content"

export function HeroV7Root(props: HeroV7Props) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <HeroContent {...props} />
    </div>
  )
}
