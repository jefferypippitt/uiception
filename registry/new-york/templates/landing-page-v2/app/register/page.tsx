import { BackLink } from "../../components/back-link"
import { DirectionalTransition } from "../../components/directional-transition"
import { RegisterForm } from "../../components/register-form"
import { site } from "../../lib/site"

export default function RegisterPage() {
  return (
    <DirectionalTransition>
      <main className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden">
        <BackLink className="absolute top-6 left-6 z-10 md:top-8 md:left-10" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 px-8 py-16 md:px-12 lg:flex-row lg:items-center lg:gap-24 lg:px-16 lg:py-24">
          <section className="flex w-full flex-col lg:w-[42%] lg:shrink-0">
            <h1 className="text-balance text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-white uppercase [text-shadow:0_0_40px_rgba(0,0,0,0.55)]">
              {site.register.title}
            </h1>
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
