import { Button } from "@/components/ui/button"

import { CtaSectionV4ShaderBg } from "./cta-section-v4-shader-bg"

import "../styles/cta-section-v4.css"

export default function CtaSectionV4() {
  return (
    <section className="relative overflow-hidden bg-[#000a0f] py-16 motion-reduce:bg-[color-mix(in_oklab,var(--muted)_78%,var(--background)_22%)] md:py-20 lg:py-24">
      <CtaSectionV4ShaderBg />
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="m-0 font-serif text-[2.625rem] font-medium leading-[1.08] tracking-[-0.03em] text-balance text-white motion-reduce:text-foreground sm:text-5xl lg:text-[3.5rem]">
            Your next product starts here.
          </h2>
          <div className="flex flex-row items-center gap-2"> 
          <Button variant="default" size="lg">Get Started</Button>
          <Button variant="secondary" size="lg">Sign In</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
