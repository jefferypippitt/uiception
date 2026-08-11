import Link from "next/link"

import { DirectionalTransition } from "../../components/directional-transition"
import { GlowCanvas } from "../../components/glow-canvas"
import { RegisterForm } from "../../components/register-form"
import { site } from "../../lib/site"

export default function RegisterPage() {
  return (
    <DirectionalTransition>
      <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden">
        <GlowCanvas className="opacity-70" />

        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="absolute top-6 left-6 z-10 text-sm text-white/45 transition-colors hover:text-white/80 md:top-8 md:left-10"
        >
          ← {site.name}
        </Link>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 px-8 py-16 md:px-12 lg:flex-row lg:items-center lg:gap-24 lg:px-16 lg:py-24">
          <section className="flex w-full flex-col lg:w-[42%] lg:shrink-0">
            <p className="text-sm tracking-[-0.01em] text-white/45">
              {site.date}
              <span aria-hidden className="mx-2 text-white/25">
                ·
              </span>
              {site.city}
            </p>
            <h1 className="mt-5 max-w-[16ch] text-balance text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[0.95] font-medium tracking-[-0.08rem] text-white [text-shadow:0_0_40px_rgba(0,0,0,0.55)]">
              {site.name}
            </h1>
            <p className="mt-7 max-w-sm text-[clamp(1.25rem,2vw,1.75rem)] leading-snug font-medium tracking-[-0.03em] text-white">
              {site.register.title}
            </p>
            <p className="mt-4 max-w-sm text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-white/55">
              {site.register.description}
            </p>
          </section>

          <section className="w-full min-w-0 flex-1 lg:max-w-md">
            <RegisterForm />
          </section>
        </div>
      </main>
    </DirectionalTransition>
  )
}
