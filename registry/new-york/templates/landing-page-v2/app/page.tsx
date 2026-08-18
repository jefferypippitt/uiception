import { DirectionalTransition } from "../components/directional-transition"
import { HeroSection } from "../components/hero-section"

export default function HomePage() {
  return (
    <DirectionalTransition>
      <main className="relative z-10">
        <HeroSection />
      </main>
    </DirectionalTransition>
  )
}
